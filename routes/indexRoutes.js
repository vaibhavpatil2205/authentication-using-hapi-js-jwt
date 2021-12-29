const indexController = require("../controllers/indexController");
const Joi = require("joi");

module.exports = [
  {
    method: "GET",
    path: "/",
    handler: indexController.getHomePage,
  },
  {
    method: "GET",
    path: "/signup",
    handler: indexController.getSignupPage,
  },
  {
    method: "POST",
    path: "/signup",
    handler: indexController.handleSignup,
  },
  {
    method: "GET",
    path: "/login",
    handler: indexController.getLoginPage,
  },
  {
    method: "POST",
    path: "/login",
    handler: indexController.handleLogin,
  },
  {
    method: "GET",
    path: "/protected",
    handler: indexController.getProtectedPage,
  },
  {
    method: "GET",
    path: "/logout",
    handler: indexController.logout,
  },
];
