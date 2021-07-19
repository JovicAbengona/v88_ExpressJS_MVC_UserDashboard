const { validationResult } = require("express-validator");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const moment = require("moment");

module.exports = {
    index: async(request, response) => {
        if(request.session.user_id != null){
            response.locals.user_id = request.session.user_id;
            response.locals.first_name = request.session.first_name;
            response.locals.user_level = request.session.user_level;

            const [users] = await User.getAllUsers();

            response.render("dashboard/index", { users, moment });
        }
        else{
            response.redirect("/");
        }
    },
    add_user: async(request, response) => {
        response.locals.user_id = request.session.user_id;
        response.locals.first_name = request.session.first_name;
        response.locals.user_level = request.session.user_level;

        response.render("dashboard/add_user");
    },
    get_user: async(request, response) => {
        const action = request.params.action;
        response.locals.user_id = request.session.user_id;
        response.locals.first_name = request.session.first_name;
        response.locals.user_level = request.session.user_level;

        if(action == "edit"){
            const id = request.params.id;
            const [user] = await User.getUser(id);
            response.render("dashboard/edit_user", { user: user[0] });
        }
        else if(action == "delete"){
            const id = request.params.id;
            const [user] = await User.getUser(id);
            response.render("dashboard/delete_user", { user: user[0], moment });
        }
        else if(action == "show"){
            const id = request.params.id;
            const [user] = await User.getUser(id);
            const [messages] = await User.getMessages(id);
            const [comments] = await User.getComments(id);
            const calculateTime = User.calculateTime;
            response.render("dashboard/show_user", { user: user[0], messages, comments, calculateTime, moment });
        }
        else{
            const [user] = await User.getUser(request.session.user_id);
            response.render("dashboard/user_profile", { user: user[0] });
        }
    },
    logoff: async(request, response) => {
        request.session.destroy();
        response.redirect("/");
    }
}