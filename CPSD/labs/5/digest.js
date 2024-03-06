const express = require('express')
const passport = require('passport')
const DigestStrategy = require('passport-http').DigestStrategy
const authData = require('./authData')

passport.use(new DigestStrategy({ qop: 'auth' }, 
    (username, done) => {
        if (authData[username]) {
            const password = authData[username]
            return done(null, { username, password }, password)
        } else {
            return done(null, false, )
        }
    }
))
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
}, passport.authenticate('digest', {session: false, successRedirect: '/resource'}))

	
app.post('/logout', (req, res, next) => {
	req.logout(function(err) {
		if (err) { 
			return next(err)
		}
		res.status(401).send()
	})
})

app.get('/resource', 
	passport.authenticate('digest', {session: false, failureRedirect: "/login"}),
	(req, res) => {
		res.contentType('html').send('<body><p>digest</p><form action="logout" method="post"><input type="submit"/>' + 
			'</form>')
})

app.use((req, res) => {
	res.status(404).send('404 Not Found')
})

app.listen(3000, () => {
	console.log('Приложение запущено на порту 3000')
})