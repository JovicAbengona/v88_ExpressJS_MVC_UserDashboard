const { validationResult } = require("express-validator");
const User = require("../models/User");

module.exports = {
    index: (request, response) => {
        response.render("home/index");
    },
    signin: (request, response) => {
        response.render("home/signin");
    },
    process_signin: async (request, response) => {
        const [login] = await User.login(request.body.email, request.body.password);
        if(login.length < 1){
            response.render("templates/login_error", { message: "Incorrect email address or password" });
        }
        else{
            request.session.user_id = login[0].id;
            request.session.email = login[0].email;
            request.session.first_name = login[0].first_name;
            request.session.last_name = login[0].last_name;

            response.render("templates/login_error", { message: "Success" });
        }
    },
    register: (request, response) => {
        response.render("home/register");
    },
    process_registration: async (request, response) => {
        const errors = validationResult(request);
        const [getEmail] = await User.checkEmail(request.body.email);
        let messages = [{ "type": "error", "msg": [] }];
        
        if(getEmail.length > 0){
            messages[0]["msg"].push({
                "element": "email",
                "message": "This email is already registered"
            });
        }
        
        if(!errors.isEmpty() || request.body.password != request.body.confirm_password){
            errors.array().forEach(value => {
                messages[0]["msg"].push({
                    "element": value.param,
                    "message": value.msg
                });
            });
            if(request.body.password != request.body.confirm_password){
                messages[0]["msg"].push({
                    "element": "confirm_password",
                    "message": "Passwords doesn't match"
                });
            }

            const alert = messages;
            response.render("templates/registration_errors", { alert });
        }
        else{
            const [checkIfFirstUser] = await User.checkIfFirstUser();
            let user_level;
            
            if(checkIfFirstUser.length == 0)
                user_level = 9;
            else
                user_level = 0;
            
            await User.register(request.body.email, request.body.first_name, request.body.last_name, request.body.password, user_level);
            await User.createProfile();
            const alert = [{"type": "success", "message": "You're successfully registered"}];
            response.render("templates/registration_errors", { alert });
        }
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