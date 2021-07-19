const { validationResult } = require("express-validator");
const User = require("../models/User");
const bcrypt = require("bcrypt");

module.exports = {
    index: (request, response) => {
        if(request.session.user_id == null)
            response.render("home/index");
        else
        response.redirect("dashboard/admin");
    },
    signin: (request, response) => {
        if(request.session.user_id == null)
            response.render("home/signin");
        else
        response.redirect("dashboard/admin");
    },
    register: (request, response) => {
        if(request.session.user_id == null)
            response.render("home/register");
        else
            response.redirect("dashboard/admin");
    },
    logout: (request, response) => {
        request.session.destroy();
        response.redirect("/");
    }
}