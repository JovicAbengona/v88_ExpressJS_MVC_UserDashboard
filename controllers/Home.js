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
    profile: (request, response) => {
        if(request.session.user_id != null){
            const user_data = {
                "id": request.session.user_id,
                "email": request.session.email,
                "first_name": request.session.first_name,
                "last_name": request.session.last_name,
            }
            response.render("profile", { data: user_data });
        }
        else{
            response.redirect("/");
        }
    },
    logout: (request, response) => {
        request.session.destroy();
        response.redirect("/");
    }
}