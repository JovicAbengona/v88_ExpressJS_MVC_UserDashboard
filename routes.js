const Express = require("express");
const Router = Express.Router();
const bodyParser = require("body-parser");
const Home = require("./controllers/Home");
const Users = require("./controllers/Users");
const Dashboard = require("./controllers/Dashboard");
const { body } = require("express-validator");

Router.use(bodyParser.urlencoded({ extended: true }));

// Home Routes
Router.get("/", Home.index);
Router.get("/signin", Home.signin);
Router.get("/register", Home.register);

// Dashboard Routes
Router.get("/dashboard/admin", Dashboard.index);
Router.get("/dashboard", Dashboard.index);
Router.get("/dashboard/users/new", Dashboard.add_user);
Router.get("/logoff", Dashboard.logoff);
Router.get("/dashboard/users/edit", Dashboard.get_user);
Router.get("/dashboard/users/:action/:id", Dashboard.get_user);

// User Routes
Router.post("/process_signin", Users.process_signin);
Router.post("/process_registration", 
    body("email").isEmail().withMessage("Please enter a valid email address"),
    body("first_name").notEmpty().withMessage("First name can't be empty"),
    body("last_name").notEmpty().withMessage("Last name can't be empty"),
    body("password").isLength({ min: 6}).withMessage("Password should be at least 6 characters"),
    body("confirm_password").not().matches('password').withMessage('Passwords must match')
, Users.process_registration);
Router.post("/process_add_user",
    body("email").isEmail().withMessage("Please enter a valid email address"),
    body("first_name").notEmpty().withMessage("First name can't be empty"),
    body("last_name").notEmpty().withMessage("Last name can't be empty"),
    body("password").isLength({ min: 6}).withMessage("Password should be at least 6 characters"),
    body("confirm_password").not().matches('password').withMessage('Passwords must match')
, Users.process_add_user);
Router.post("/process_update_user/:id", 
    body("email").isEmail().withMessage("Please enter a valid email address"),
    body("first_name").notEmpty().withMessage("First name can't be empty"),
    body("last_name").notEmpty().withMessage("Last name can't be empty")
, Users.process_update_user);
Router.post("/process_change_password/:id", 
    body("password").isLength({ min: 6}).withMessage("Password should be at least 6 characters"),
    body("confirm_password").not().matches('password').withMessage('Passwords must match')
, Users.process_change_pass);
Router.post("/process_edit_description/:id", 
    body("description").notEmpty().withMessage("Description can't be empty")
, Users.process_edit_description);
Router.post("/process_delete_user/:id", Users.process_delete_user);


module.exports = Router;