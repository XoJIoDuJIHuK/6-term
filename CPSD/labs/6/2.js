const express = require('express')
const session = require('express-session')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const salt = '$2b$10$iujfXl.zABzRKFiRSkMl3.'
const { Sequelize, DataTypes } = require('sequelize')
const cookieParser = require('cookie-parser')
const redis = require('redis')
let redisClient
redis.createClient({
	host: 'localhost',
	port: 6379
}).connect().then(c => { redisClient = c })

const { AUTH } = require('./model')
const refreshSecret = 'refresh-secret'
const accessSecret = 'access-secret'

const app = express()
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.use(session({
	secret: 'secret-key',
	resave: false,
	saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())

passport.use(new LocalStrategy(
	async (username, password, done) => {
		try {
			const user = await AUTH.findOne({ where: { username } })
			if (!user) {
				return done(null, false)
			}
			const passwordMatch = await bcrypt.compare(password, user.password)
			if (!passwordMatch) {
				return done(null, false)
			}
			return done(null, user)
		} catch (error) {
			return done(error)
		}
	}
))

passport.serializeUser((user, done) => {
	done(null, user.id)
})

passport.deserializeUser(async (id, done) => {
	try {
		const user = await AUTH.findByPk(id)
		done(null, user)
	} catch (error) {
		done(error)
	}
})

const authenticateTokens = async (req, res, next) => {
	const refreshToken = req.cookies.refresh_token
	const accessToken = req.cookies.access_token
	const username = req.cookies.username
	if (refreshToken && accessToken) {
		try {
			jwt.verify(refreshToken, refreshSecret)
			if (refreshToken !== await redisClient.get(getTokenName(username, false))) {
				throw new Error('refresh token not in white list')
			}
			jwt.verify(accessToken, accessSecret, async (err, user) => {
				if (err) {
					if (err.name === 'TokenExpiredError') {
						const user = jwt.verify(await setNewToken(req, res, true), accessSecret)
						req.user = user
					} else {
						throw err
					}
				} else {
					if (accessToken !== await redisClient.get(getTokenName(username, true))) {
						throw new Error('access token not in white list')
					}
					req.user = user
				}
				next()
			})
		} catch (err) {
			if (err.name === 'TokenExpiredError') {
				res.redirect('/logout')
			} else {
				res.status(400).send(JSON.stringify(err))
			}
		}
	} else {
		res.redirect('/logout')
	}
}

app.get('/login', (req, res) => {
	res.send(`
		<h1>Login</h1>
		<form action="/login" method="post">
			<input type="text" name="username" placeholder="Username" required><br>
			<input type="password" name="password" placeholder="Password" required><br>
			<button type="submit">Login</button>
		</form>
	`)
})

app.post('/login', passport.authenticate('local', { session: false, failureRedirect: '/login' }),
	async (req, res) => { await login(req, res) })

app.get('/register', (req, res) => {
	res.send(`
		<h1>Register</h1>
		<form action="/register" method="post">
			<input type="text" name="username" placeholder="Username" required><br>
			<input type="password" name="password" placeholder="Password" required><br>
			<button type="submit">Register</button>
		</form>
	`)
})

app.post('/register', async (req, res) => {
	const { username, password } = req.body
	const user = await AUTH.findByPk(username)
	if (user) {
		res.status(404).send('user exists')
		return
	} else {
		await AUTH.create({ username, password })
	}
	await login(req, res)
})

app.get('/refresh-token', (req, res) => {
	const refreshToken = req.cookies.refresh_token

	if (!refreshToken) {
		return res.sendStatus(401)
	}

	jwt.verify(refreshToken, refreshSecret, (err, user) => {
		if (err) {
			return res.sendStatus(401)
		}
		setNewToken(req, res, true)
		setNewToken(req, res, false)

		res.sendStatus(200)
	})
})

app.get('/logout', async (req, res) => {
	const username = req.cookies.username

	redisClient.del(getTokenName(username, true))
	redisClient.del(getTokenName(username, false))

	res.clearCookie('access_token')
	res.clearCookie('refresh_token')
	res.clearCookie('username')
	res.redirect('/login')
})

app.get('/resource', authenticateTokens, (req, res) => {
	res.send(`
		<h1>Resource</h1>
		<p>Welcome, ${req.user.username}!</p>
		<p>RESOURCE</p>
	`)
})

app.use((req, res) => {
	res.sendStatus(404)
})

app.listen(3000, () => {
	console.log('Server started on port 3000')
})

function getTokenName(username, access = true) {
	return `${username}-${access ? 'access' : 'refresh'}`
}
async function login(req, res) {
	res.cookie('username', req.body.username, { httpOnly: true, sameSite: 'strict' })
	await setNewToken(req, res, true)
	const refreshToken = await setNewToken(req, res, false)
	await redisClient.set(getTokenName(req.body.username, false), refreshToken)
	res.redirect('/resource')
}
async function setNewToken(req, res, access) {
	const secret = access ? accessSecret : refreshSecret
	const cookieName = access ? 'access_token' : 'refresh_token'
	const seconds = access ? 10 * 60 : 24 * 60 * 60
	const username = req.cookies.username ?? req.body.username
	const token = jwt.sign({
		username,
		exp: Math.floor(Date.now() / 1000) + seconds
	}, secret)
	res.cookie(cookieName, token, { httpOnly: true, sameSite: 'strict' })
	await redisClient.set(getTokenName(username, access), token)
	return token
}