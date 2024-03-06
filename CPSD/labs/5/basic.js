const express = require('express')
const passport = require('passport')
const BasicStrategy = require('passport-http').BasicStrategy
const authData = require('./authData')

passport.use(new BasicStrategy((username, password, done) => {
	if (authData[username] === password) {
		return done(null, { username, password })
	} else {
		return done('wrong credentials')
	}
}))
const app = express()
app.use(require('express-session')({ 
	secret: 'keyboard cat', 
	resave: false, 
	saveUninitialized: false,
}))
app.use(passport.initialize())

passport.serializeUser((user, done) => {
	done(null, user.username)
})
passport.deserializeUser((username, done) => {
	const password = authData[username]
	if (password) {
		done(null, { username, password })
	} else {
		done(new Error('no such user'), null)
	}
})


app.get('/login', (req, res, next) => {
	next();
}, passport.authenticate('basic', {session: false, successRedirect: '/resource'}))

	
app.post('/logout', (req, res, next) => {
	req.logout(function(err) {
		if (err) { 
			return next(err)
		}
		res.status(401)
	})
})

app.get('/resource', 
	passport.authenticate('basic', {session: false, failureRedirect: "/login"}),
	(req, res) => {
		res.contentType('html').send('<body><p>Ресурс</p><form action="logout" method="post"><input type="submit"/>' + 
			'</form>')
})

app.use((req, res) => {
	res.status(404).send('404 Not Found')
})

app.listen(3000, () => {
	console.log('Приложение запущено на порту 3000')
})