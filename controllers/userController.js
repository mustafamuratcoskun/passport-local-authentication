const User = require("../models/User");
const bcrpypt = require("bcryptjs");
const validation = require("../validation");
const passport = require("passport");

require("../config/localStrategy");

module.exports.getUserLogin = (req, res, next) => {
  res.render("login");
};

module.exports.postUserLogin = (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
    successFlash: true
  })(req, res, next);
};
module.exports.getUserRegister = (req, res, next) => {
  res.render("register");
};
module.exports.getUserLogout = (req, res, next) => {
  req.logout();
  res.redirect("/login");
};
module.exports.postUserRegister = (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  const errors = validation.registerValidation(username, password);
  // Server Side Validation
  if (errors.length > 0) {
    return res.render("register", {
      username,
      password,
      errors
    });
  } else {
    // Username Verification
    User.findOne({
      username: username
    })
      .then(user => {
        if (user) {
          errors.push({ message: "Username Already In Use" });

          return res.render("register", {
            username,
            password,
            errors
          });
        } else {
          bcrpypt.genSalt(10, (err, salt) => {
            bcrpypt.hash(password, salt, (err, hash) => {
              if (err) throw err;
              const newUser = new User({
                username: username,
                password: hash
              });

              newUser
                .save()
                .then(user => {
                  req.flash("flashSuccess", "Succesfully Registered");

                  res.redirect("/");
                })
                .catch(err => console.log(err));
            });
          });
        }
      })
      .catch(err => console.log(err));
  }
};
