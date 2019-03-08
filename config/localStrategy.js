const LocalStrategy = require("passport-local").Strategy;
const passport = require("passport");
const bcrpypt = require("bcryptjs");
const User = require("../models/User");

passport.use(
  new LocalStrategy((username, password, done) => {
    User.findOne(
      {
        username
      },
      (err, user) => {
        if (err) {
          return done(err, null);
        }
        if (!user) {
          return done(null, false, "User Not Found");
        }
        bcrpypt.compare(password, user.password, (err, res) => {
          if (res) {
            return done(null, user, "Successfully Login");
          }
          return done(null, false, "Incorrect Password!");
        });
      }
    );
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});
