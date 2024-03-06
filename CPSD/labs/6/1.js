const express = require('express')
const session = require('express-session')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

const app = express()
app.use(express.urlencoded({ extended: true }))

app.use(session({
	secret: 'secret-key',
	resave: false,
	saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())

const users = require('../5/authData')

passport.use(new LocalStrategy(
	(username, password, done) => {
		if (users.hasOwnProperty(username) && users[username] === password) {
			return done(null, { username: username })
		} else {
			return done(null, false)
		}
	}
))

passport.serializeUser((user, done) => {
	done(null, user.username)
})

passport.deserializeUser((username, done) => {
	done(null, { username: username })
})

app.get('/login', (req, res) => {
	res.send(`
		<h1>Login</h1>
		<form action="/login" method="post">
			<input type="text" name="username" placeholder="Username" required><br>
			<input type="password" name="password" placeholder="Password" required><br>
			<button>Login</button>
		</form>
	`)
})

app.post('/login', passport.authenticate('local', {
	successRedirect: '/resource',
	failureRedirect: '/login'
}))

app.get('/logout', (req, res) => {
	req.logout()
	res.redirect('/')
})

app.get('/resource', (req, res) => {
	if (req.isAuthenticated()) {
		res.send(`RESOURCE<br>Authenticated User: ${req.user.username}`)
	} else {
		res.status(401).send('Unauthorized')
	}
})

app.use((req, res) => {
	res.status(404).send('Not Found')
})

app.listen(3000, () => {
	console.log('Server started on port 3000')
})