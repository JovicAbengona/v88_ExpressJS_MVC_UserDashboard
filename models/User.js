const Config = require("../config");

module.exports = {
    login: (email, password) => {
        return Config.db.execute(`SELECT * FROM user_dashboard.users WHERE email = ?`, [email]);
    },
    register: (email, first_name, last_name, password, user_level) => {
        return Config.db.execute(`INSERT INTO user_dashboard.users (email, first_name, last_name, password, user_level, created_at, updated_at) 
                                    VALUES (?, ?, ?, ?, ?, NOW(), NOW())`, [email, first_name, last_name, password, user_level]);
    },
    createProfile: () => {
        return Config.db.execute(`INSERT INTO user_dashboard.profiles (user_id, created_at, updated_at)
                                    VALUES (LAST_INSERT_ID(), NOW(), NOW())`);
    },
    checkEmail: (email) => {
        return Config.db.execute(`SELECT id, email FROM user_dashboard.users WHERE email = ?`, [email]);
    },
    checkIfFirstUser: () => {
        return Config.db.execute("SELECT * FROM user_dashboard.users");
    },
    getUser: (id) => {
        return Config.db.execute(`SELECT u.*, p.id AS 'profile_id', p.description
                                    FROM user_dashboard.users AS u 
                                    INNER JOIN profiles AS p
                                    ON u.id = p.user_id
                                    WHERE u.id = ?`, [id]);
    },
    getAllUsers: () => {
        return Config.db.execute(`SELECT u.*, p.id AS 'profile_id'
                                    FROM user_dashboard.users AS u 
                                    INNER JOIN profiles AS p
                                    ON u.id = p.user_id
                                    ORDER BY u.user_level DESC`);
    },
    updateUser: (id, email, first_name, last_name, user_level = null) => {
        if(user_level != null){
            return Config.db.execute(`UPDATE user_dashboard.users 
                                        SET email = ?, first_name = ?, last_name = ?, user_level = ?, updated_at = NOW()
                                        WHERE id = ?`, [email, first_name, last_name, user_level, id]);
        }
        else{
            return Config.db.execute(`UPDATE user_dashboard.users 
                                        SET email = ?, first_name = ?, last_name = ?, updated_at = NOW()
                                        WHERE id = ?`, [email, first_name, last_name, id]);
        }
        
    },
    changePassword: (id, password) => {
        return Config.db.execute(`UPDATE user_dashboard.users
                                    SET password = ?, updated_at = NOW()
                                    WHERE id = ?`, [password, id]);
    },
    updateDescripton: (id, description) => {
        return Config.db.execute(`UPDATE user_dashboard.profiles
                                    SET description = ?, updated_at = NOW()
                                    WHERE user_id = ?`, [description, id]);
    },
    deleteUser: (id) => {
        return Config.db.execute("DELETE FROM user_dashboard.users WHERE id = ?", [id]);
    },
    calculateTime: (time) => {
        if(time < 60)
            result = "A few seconds ago.";
        else if(time >= 60 && time < 120)
            result = "A minute ago.";
        else if(time >= 120 && time < 3600)
            result = `${Math.floor(time/60)} minutes ago`;
        else if(time >= 3600 && time < 86400 && Math.floor(time/(60*60)) == 1)
            result = "An hour ago.";
        else if(time >= 3600 && time < 86400 && Math.floor(time/(60*60)) > 1)
            result = time = `${Math.floor(time/(60*60))} hours ago`;
        else if(time >= 86400 && time < 604800 && Math.floor(time/(60*60*24)) == 1)
            result = "A day ago.";
        else if(time >= 86400 && time < 604800 && Math.floor(time/(60*60*24)) > 1)
            result = `${Math.floor(time/(60*60*24))} days ago`;
        else if(time >= 604800 && time < 691200)
            result = "A week ago";
        else
            result = "None";
        
        return result;
    },
    getMessages: (id) => {
        return Config.db.execute(`SELECT u.id, CONCAT(u.first_name, ' ', u.last_name) AS 'name', m.id AS 'message_id', m.user_id AS 'sender_id', CONCAT(u_2.first_name, ' ', u_2.last_name) AS 'sender', m.content, m.created_at, TIMESTAMPDIFF(SECOND, m.created_at, NOW()) AS 'sent'
                                    FROM users AS u
                                    INNER JOIN profiles AS p
                                        ON  u.id = p.user_id
                                    INNER JOIN messages AS m
                                        ON p.id = m.profile_id
                                    INNER JOIN users AS u_2
                                        ON m.user_id = u_2.id
                                    WHERE u.id = ?	
                                    ORDER BY m.created_at DESC`, [id]);
    },
    getComments: (id) => {
        return Config.db.execute(`SELECT c.message_id AS 'message_id', c.id AS 'comment_id', c.user_id AS 'sender_id', CONCAT(u_2.first_name, ' ', u_2.last_name) AS 'sender', c.content, TIMESTAMPDIFF(SECOND, c.created_at, NOW()) AS 'sent'
                                    FROM users AS u
                                    INNER JOIN profiles AS p
                                        ON u.id = p.user_id
                                    INNER JOIN messages AS m
                                        ON p.id = m.profile_id
                                    INNER JOIN comments AS c
                                        ON m.id = c.message_id
                                    INNER JOIN users AS u_2
                                        ON c.user_id = u_2.id
                                    WHERE u.id = ?`, [id]);
    },
    postMessage: (profile_id, sender_id, message) => {
        return Config.db.execute(`INSERT INTO user_dashboard.messages (profile_id, user_id, content, created_at, updated_at)
                                    VALUES(?, ?, ?, NOW(), NOW())`, [profile_id, sender_id, message]);
    },
    postComment: (message_id, sender_id, message) => {
        return Config.db.execute(`INSERT INTO user_dashboard.comments (message_id, user_id, content, created_at, updated_at)
                                    VALUES(?, ?, ?, NOW(), NOW())`, [message_id, sender_id, message]);
    }
}