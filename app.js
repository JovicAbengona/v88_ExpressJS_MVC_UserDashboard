const Express = require("express");
const App = Express();
const Routes = require("./routes");
const ErrController = require("./controllers/Errors");
const Session = require("express-session");
const ConnectRedis = require("connect-redis");
const RedisStore = ConnectRedis(Session);
const Config = require("./config");

App.use(Express.static(__dirname + "/assets"));
App.set('views', __dirname + '/views'); 
App.set('view engine', 'ejs');
App.use(Session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
    name: "some_cookie_id",
    store: new RedisStore({ client: Config.Client })
}));

//Use Routes
App.use(Routes);

// Errors
App.use(ErrController.get404); // not found
App.use(ErrController.get500); // server error

App.listen(3000, function(){
    console.log("Listening on 3000");
});