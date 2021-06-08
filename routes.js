const Express = require("express");
const Router = Express.Router();
const bodyParser = require("body-parser");
const Home = require("./controllers/Home");
const { body } = require("express-validator");

Router.use(bodyParser.urlencoded({ extended: true }));

// Home Routes
Router.get("/", Home.index);
Router.get("/signin", Home.signin);
Router.post("/process_signin", Home.process_signin);
Router.get("/register", Home.register);
Router.post("/process_registration", 
    body("email").isEmail().withMessage("Please enter a valid email address"),
    body("first_name").notEmpty().withMessage("First name can't be empty"),
    body("last_name").notEmpty().withMessage("Last name can't be empty"),
    body("password").isLength({ min: 6}).withMessage("Password should be at least 6 characters"),
    body("confirm_password").not().matches('password').withMessage('Passwords must match')
, Home.process_registration);

// User Routes
// Router.get("/students/profile", User.profile);
// Router.get("/logout", User.logout);

module.exports = Router;