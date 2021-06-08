// Database Configuration
const MySQL = require("mysql2");
const Config = require("./config.json");
const Connection = MySQL.createConnection({
    "host": Config.localhost,
    "user": Config.user,
    "password": Config.password,
    "database": Config.database,
    "port": Config.port,
});

// Redis Configuration
const Redis = require("redis");
const Client = Redis.createClient();

Client.on("connect", () => {
    console.log("Connected to Redis");
});

module.exports = {
    Client,
    "db": Connection.promise()
}