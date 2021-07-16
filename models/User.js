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
    }
}