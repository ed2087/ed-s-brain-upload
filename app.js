//require all the modules for a user to be able to login
const express = require('express');

const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const flash = require('connect-flash');
const mongoose = require('mongoose');
const path = require('path');

const app = express();


// request routes
const AdminRoutes = require('./routes/adminRoutes.js');
const UserRoutes = require('./routes/userRoutes.js');
const MainRoutes = require('./routes/mainRoutes.js');

//connect to the database
const _port = "3000";
const mongoDB = `mongodb+srv://global:HC3CjyzTWGzNpVAY@cluster0.x2vf7q2.mongodb.net/ChatEd?retryWrites=true&w=majority`;


//ejs
app.set("view engine", "ejs");
app.set("views", "views");

//static files
//allow css js files
app.use(express.urlencoded({extended: true}));
app.use(express.json()) // To parse the incoming requests with JSON payloads
app.use(express.static(path.join(__dirname, "public")));

   

app.use(AdminRoutes);
app.use(MainRoutes);
app.use(UserRoutes);


//conexion to mongoDB
app.listen(process.env.PORT || _port, (err) => {
    
    if(err) {
        console.log(err);
    } else {
        console.log('Listening to port ' + _port);
    }

});
