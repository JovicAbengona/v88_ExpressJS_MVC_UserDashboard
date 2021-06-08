const Config = require("../config");

module.exports = {
    login: (email, password) => {
        return Config.db.execute(`SELECT * FROM user_dashboard.users WHERE email = ? AND password = MD5(?)`, [email, password]);
    },
    register: (email, first_name, last_name, password, user_level) => {
        return Config.db.execute(`INSERT INTO user_dashboard.users (email, first_name, last_name, password, user_level, created_at, updated_at) 
                            VALUES (?, ?, ?, MD5(?), ?, NOW(), NOW())`, [email, first_name, last_name, password, user_level]);
    },
    createProfile: () => {
        return Config.db.execute(`INSERT INTO user_dashboard.profiles (user_id, created_at, updated_at)
                            VALUES (LAST_INSERT_ID(), NOW(), NOW())`);
    },
    checkEmail: (email) => {
        return Config.db.execute(`SELECT email FROM user_dashboard.users WHERE email = ?`, [email]);
    },
    checkIfFirstUser: () => {
        return Config.db.execute("SELECT * FROM user_dashboard.users");
    }
}