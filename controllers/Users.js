const { validationResult } = require("express-validator");
const User = require("../models/User");
const bcrypt = require("bcrypt");

module.exports = {
    process_signin: async (request, response) => {
        const [login] = await User.login(request.body.email);

        if(login.length < 1){
            response.render("templates/login_status", { message: "Incorrect email address or password" });
        }
        else{
            if(await bcrypt.compare(request.body.password, login[0].password)){
                request.session.user_id = login[0].id;
                request.session.email = login[0].email;
                request.session.first_name = login[0].first_name;
                request.session.last_name = login[0].last_name;
                request.session.user_level = login[0].user_level;
                
                response.render("templates/login_status", { message: `${login[0].user_level}` });
            }
            else
                response.render("templates/login_status", { message: "Incorrect email address or password" });
        }
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
        
        if(!errors.isEmpty() || messages[0]["msg"].length > 0 || request.body.password != request.body.confirm_password){
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
            response.render("templates/action_status", { alert });
        }
        else{
            const [checkIfFirstUser] = await User.checkIfFirstUser();
            let password = request.body.password
            let user_level;
            
            if(checkIfFirstUser.length == 0)
                user_level = 9;
            else
                user_level = 0;
            
            // Encrypt Password
            password = await bcrypt.hash(password, 10);
            
            await User.register(request.body.email, request.body.first_name, request.body.last_name, password, user_level);
            await User.createProfile();
            const alert = [{"type": "success", "message": "You're successfully registered"}];
            response.render("templates/action_status", { alert });
        }
    },
    process_add_user: async(request, response) => {
        const errors = validationResult(request);
        const [getEmail] = await User.checkEmail(request.body.email);
        let messages = [{ "type": "error", "msg": [] }];
        
        if(getEmail.length > 0){
            messages[0]["msg"].push({
                "element": "email",
                "message": "This email is already registered"
            });
        }
        
        if(!errors.isEmpty() || messages[0]["msg"].length > 0 || request.body.password != request.body.confirm_password){
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
            response.render("templates/action_status", { alert });
        }
        else{
            const [checkIfFirstUser] = await User.checkIfFirstUser();
            let password = request.body.password
            let user_level;
            
            if(checkIfFirstUser.length == 0)
                user_level = 9;
            else
                user_level = 0;
            
            // Encrypt Password
            password = await bcrypt.hash(password, 10);
            
            await User.register(request.body.email, request.body.first_name, request.body.last_name, password, user_level);
            await User.createProfile();
            const alert = [{"type": "success", "message": "User successfully added"}];
            response.render("templates/action_status", { alert });
        }
    },
    process_update_user: async(request, response) => {
        const id = request.params.id;
        const errors = validationResult(request);
        const [getEmail] = await User.checkEmail(request.body.email);
        let messages = [{ "type": "error", "msg": [] }];
        
        if(getEmail.length > 0){
            if(getEmail[0].id != id){
                messages[0]["msg"].push({
                    "element": "email",
                    "message": "This email is already registered"
                });
            }
        }
        
        if(!errors.isEmpty() || messages[0]["msg"].length > 0){
            errors.array().forEach(value => {
                messages[0]["msg"].push({
                    "element": value.param,
                    "message": value.msg
                });
            });

            const alert = messages;
            response.render("templates/action_status", { alert });
        }
        else{
            if(request.body.user_level != undefined)
                await User.updateUser(id, request.body.email, request.body.first_name, request.body.last_name, request.body.user_level);
            else
                await User.updateUser(id, request.body.email, request.body.first_name, request.body.last_name);
            const alert = [{"type": "success", "message": "User successfully updated"}];
            response.render("templates/action_status", { alert });
        }
    },
    process_change_pass: async(request, response) => {
        const id = request.params.id;
        const errors = validationResult(request);
        let messages = [{ "type": "error", "msg": [] }];

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
            response.render("templates/action_status", { alert });
        }
        else{
            let password = request.body.password
            
            // Encrypt Password
            password = await bcrypt.hash(password, 10);
            
            await User.changePassword(id, password);
            const alert = [{"type": "success", "message": "Password changed successfully"}];
            response.render("templates/action_status", { alert });
        }
    },
    process_edit_description: async(request, response) => {
        const id = request.params.id;
        const errors = validationResult(request);
        let messages = [{ "type": "error", "msg": [] }];
        
        if(!errors.isEmpty() || messages[0]["msg"].length > 0){
            errors.array().forEach(value => {
                messages[0]["msg"].push({
                    "element": value.param,
                    "message": value.msg
                });
            });

            const alert = messages;
            response.render("templates/action_status", { alert });
        }
        else{
            await User.updateDescripton(id, request.body.description);
            const alert = [{"type": "success", "message": "Profile description successfully updated"}];
            response.render("templates/action_status", { alert });
        }
    },
    process_delete_user: async(request, response) => {
        let alert;
        if (await User.deleteUser(request.params.id)){
            alert = [{"type": "success"}];
        }
        else{
            alert = [{"type": "error", "message": "An Error Occured"}];
        }
        response.render("templates/action_status", { alert });
    }
}