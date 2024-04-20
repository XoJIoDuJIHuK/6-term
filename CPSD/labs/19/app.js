import express from "express";
import cookieParser from "cookie-parser";
import { authRouter } from "./src/routers/authRouter.js";
import { abilityRouter } from "./src/routers/abilityRouter.js";
import { usersRouter } from "./src/routers/userRouter.js";
import { reposRouter } from "./src/routers/reposRouter.js";
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import session from 'express-session';
import { prismaClient } from "./prisma/client.js";
import * as bodyParser from "express";

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: false}));

app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use("", authRouter);
app.use("/api/ability", abilityRouter);
app.use("/api/user", usersRouter);
app.use("/api/repos", reposRouter);

passport.use(new LocalStrategy(
  async (username, password, done) => {
    try {
      const user = await prismaClient.user.findFirst({
        where: {
          username: username,
        },
      });
      console.log(user);
      if (!user || user.password !== password) {
        return done(null, false, { message: 'Incorrect username or password.' });
      }
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
));

passport.serializeUser((user, done) => {
done(null, user.id);
console.log("HELLO" + user.id);
});

passport.deserializeUser(async (id, done) => {
try {
  const user = await prismaClient.user.findUnique({
  where: {
      id: id,
  },
  });
  console.log("USER:" + user.username);
  done(null, user);
} catch (error) {
  done(error);
}
});

app.use("/*", (req, res, next) => res.status(404).json({message: "Not found"}));

app.use((err, req, res, next) => {
    console.log(err);
    res.status(err.status || 500).json({message: err.message || "Something went wrong"});
});

app.listen(3000, () => console.log(`Server started successfully`));
