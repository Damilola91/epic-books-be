const express = require("express");
const session = require("express-session");
const passport = require("passport");
const google = express.Router();
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const jwt = require("jsonwebtoken");
require("dotenv").config();

const UserModel = require("../models/Usersmodel");

google.use(
  session({
    secret: process.env.GOOGLE_CLIENT_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

google.use(passport.initialize());
google.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const user = await UserModel.findOne({ email: profile._json.email });

        if (!user) {
          const { _json: user } = profile;
          const userToSave = new UserModel({
            googleId: user.id,
            name: user.given_name,
            surname: user.family_name,
            email: user.email,
            dob: new Date(),
            password: "123456789",
            username: `${user.given_name}_${user.family_name}`,
            avatar: user.picture,
          });
          user = await userToSave.save();
        }
      } catch (error) {
        console.log(error);
      }
      return done(null, profile);
    }
  )
);

google.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

google.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    const user = req.user;
    const tokenPayload = {
      name: user.name,
      surname: user.surname,
      email: user.email,
      _id: user._id,
      loginType: "google", // Aggiungi il loginType per distinguere Google
    };

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET);
    const redirectUrl = `${
      process.env.FRONTEND_URL
    }/success?token=${encodeURIComponent(token)}`;
    res.redirect(redirectUrl); // Reindirizza alla pagina con il token
  }
);

google.get("/logout", (req, res) => {
  req.logout(() => {
    req.session.destroy((err) => {
      if (err) {
        console.log("Errore durante la distruzione della sessione:", err);
        return res.redirect("/");
      }
      res.clearCookie("connect.sid"); // Cancella il cookie della sessione
      res.redirect(`${process.env.FRONTEND_URL}/login`); // Reindirizza alla pagina di login sul frontend
    });
  });
});

module.exports = google;
