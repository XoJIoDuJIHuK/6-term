const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');

const app = express();
app.use(session({
  // secret: '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',
  secret: 'xd',
  resave: false,
  saveUninitialized: true,
}));
const port = 3000;

app.use(passport.initialize());
app.use(passport.session());

passport.use(new GoogleStrategy({
    clientID: '611994598954-o41q57100h0j3vigd4q7e5afep657i7r.apps.googleusercontent.com',
    clientSecret: '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',
    callbackURL: 'http://localhost:3000/auth/google/callback'
  },
  function(accessToken, refreshToken, profile, done) {
    return done(null, profile);
  }
));
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

app.use(passport.initialize());

app.get('/login', (req, res) => {
  res.send('<a href="/auth/google">Аутентификация через Google</a>');
});

app.get('/auth/google', passport.authenticate('google', { scope: ['profile'] }));

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/error' }),
  (req, res) => {
    res.redirect('/resource');
  }
);

app.get('/logout', (req, res) => {
  req.logout(null, () => {
    res.redirect('/login');
  });
});

app.get('/resource', (req, res) => {
  if (req.isAuthenticated()) {
    const user = req.user;
    const message = 'RESOURCE';
    res.send(`${message}\n\nAuthenticated User:\n${JSON.stringify(user, null, 2)}`);
  } else {
    res.redirect('/login');
  }
});
app.get('/error', (req, res) => {
  res.send('error');
})
app.get('*', (req, res) => {
  res.status(404).send();
})

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});