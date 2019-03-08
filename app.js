// Require Necessary Modules

const express = require("express");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const userRouter = require("./routes/users");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");

const User = require("./models/User");

const PORT = 3000 || process.env.PORT;

const app = express();

// Flash Messages Configuration and Middlewares

app.use(cookieParser("passport"));
app.use(
  session({
    cookie: { maxAge: 60000 },
    resave: true,
    secret: "passport",
    saveUninitialized: true
  })
);
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

// Global Variables - For Templates

app.use((req, res, next) => {
  // Passport Flash Messages
  res.locals.successPassport = req.flash("success") || null;
  res.locals.errorPassport = req.flash("error") || null;

  // Our Own Flash Messages
  res.locals.flashSuccess = req.flash("flashSuccess") || null;
  res.locals.flashError = req.flash("flashError") || null;
  res.locals.errors = req.flash("errors") || null;

  // Our Logged In User
  res.locals.user = req.user;

  next();
});

// Mongo Db Connection
mongoose.connect("mongodb://localhost/passportdb", {
  useNewUrlParser: true
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
  console.log("Connected To Database");
});

// Handlebars Engine Middleware

app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "mainLayout"
  })
);
app.set("view engine", "handlebars");

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use((req, res, next) => {
  res.locals.test = "Test";
  next();
});

// External Routes Middleware
app.use(userRouter);

app.get("/", (req, res, next) => {
  User.find({})
    .then(users => {
      res.render("index", { users: users });
    })
    .catch(err => console.log(err));
});

app.listen(PORT, () => {
  console.log("App Started");
});
