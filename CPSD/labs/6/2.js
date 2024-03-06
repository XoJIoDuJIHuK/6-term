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
const redisClient = redis.createClient({
	host: 'localhost',
	port: 6379
})
const { AUTH } = require('./model')

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

const authenticateToken = (req, res, next) => {
	const token = req.cookies.refresh_token
	if (token) {
		jwt.verify(token, 'access-secret', (err, user) => {
			if (err) {
				return res.sendStatus(401)
			}
			req.user = user
			next()
		})
	} else {
		res.sendStatus(401)
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
	(req, res) => {
		const accessToken = jwt.sign(req.user.toJSON(), 'access-secret', { expiresIn: '10m' })
		const refreshToken = jwt.sign(req.user.toJSON(), 'refresh-secret', { expiresIn: '24h' })

		redisClient.lpush('refresh-tokens', refreshToken)

		res.cookie('access_token', accessToken, { httpOnly: true, sameSite: 'strict' })
		res.cookie('refresh_token', refreshToken, { httpOnly: true, sameSite: 'strict' })

		res.redirect('/resource')
	}
)

app.get('/refresh-token', (req, res) => {
	const refreshToken = req.cookies.refresh_token

	if (!refresh-token) {
		return res.sendStatus(401)
	}

	jwt.verify(refreshToken, 'refresh-secret', (err, user) => {
		if (err) {
			return res.sendStatus(401)
		}

		const accessToken = jwt.sign(user, 'access-secret', { expiresIn: '10m' })
		const newRefreshToken = jwt.sign(user, 'refresh-secret', { expiresIn: '24h' })

		redisClient.lpush('blacklist-refresh-tokens', refreshToken)

		redisClient.lpush('refresh-tokens', newRefreshToken)

		res.cookie('access_token', accessToken, { httpOnly: true, sameSite: 'strict' })

		res.sendStatus(200)
	})
})

app.get('/logout', (req, res) => {
	const refreshToken = req.cookies.refresh_token

	if (refreshToken) {
		redisClient.lpush('blacklist-refresh-tokens', refreshToken)
	}

	res.clearCookie('access_token')
	res.clearCookie('refresh_token')
	res.sendStatus(200)
})

app.get('/resource', authenticateToken, (req, res) => {
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

bcrypt.hash('1234', salt).then(data => {console.log(data)})