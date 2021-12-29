const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const app = require("./../app");

exports.getHomePage = function (request, h) {
  return h.view("index");
};

exports.getSignupPage = function (request, h) {
  return h.view("signup");
};

exports.getLoginPage = function (request, h) {
  return h.view("login");
};

exports.getProtectedPage = async function (request, h) {
  const token = request.state.jwt;
  let decoded;
  // console.log(token);
  if (token) {
    try {
      decoded = await promisify(jwt.verify)(token, "vaibhav-secret");
    } catch (err) {
      console.log(err.message);
    }
    return h.view("protected");
  } else {
    return h.redirect("/");
  }
};

exports.handleSignup = async function (request, h) {
  const { fullname, gender, email, password: userPassword } = request.payload;
  bcrypt.genSalt(10, function (err, salt) {
    bcrypt.hash(userPassword, salt, async function (err, hash) {
      const user = await User.create({
        fullname,
        gender,
        email,
        password: hash,
      });
    });
  });
  return h.redirect("/login");
};

exports.handleLogin = async function (request, h) {
  const { email, password } = request.payload;
  const user = await User.findOne({ email: email });
  let result;
  try {
    result = await bcrypt.compare(password, user.password);
  } catch (err) {
    console.log(err);
  }
  if (result) {
    const token = await jwt.sign(user.fullname, "vaibhav-secret");
    h.state("jwt", token);
    // changeContext({ user: true });
    app.changeContext(true);
    // console.log(token);
    return h.redirect("/");
  } else {
    return h.redirect("/login");
  }
};

exports.logout = function (request, h) {
  app.changeContext(false);
  return h.redirect("/").unstate("jwt");
};
