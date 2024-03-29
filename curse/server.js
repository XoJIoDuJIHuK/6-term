const fs = require('fs')
const express = require('express')
const session = require('express-session')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { salt, refreshSecret, accessSecret } = JSON.parse(fs.readFileSync('serverConfig.json'))
const cookieParser = require('cookie-parser')
const redis = require('redis')
let redisClient
redis.createClient({
	host: 'localhost',
	port: 6379
}).connect().then(c => { redisClient = c })
const { PROLETARIAT, CVS, BOURGEOISIE, VACANCIES, RESPONSES, REVIEWS, REGISTRATION_REQUESTS } = require('./models')

const app = express()
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.get('/prol', authenticateProletariat, (req, res) => {
	res.contentType('text/html').send('prol')
})
app.get('/bour', authenticateBourgeoisie, (req, res) => {
	res.contentType('text/html').send('bour')
})

console.log(bcrypt.hashSync('1234', salt))

app.listen(3000, () => {
	console.log('Server started on port 3000')
})

function verifyPassword(raw, encoded) {
	return bcrypt.compareSync(raw, salt) === encoded
}

function authenticateProletariat(req, res, next) {
	authenticateTokens(req, res, next, PROLETARIAT)
}
function authenticateBourgeoisie(req, res, next) {
	authenticateTokens(req, res, next, BOURGEOISIE)
}

const authenticateTokens = async (req, res, next, model) => {
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