/**
 * Created by samanthamusselman on 1/26/16.
 */
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var passport = require('passport');
var session = require('express-session');
var localStrategy = require('passport-local').Strategy;
var pg = require('pg');
var index = require('./routes/index');

var app = express();

app.use(express.static('server/public'));

var connectionString = 'postgres://localhost:5432/group_passport';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(session({
    secret: 'secret',
    key: 'user',
    resave: true,
    saveUninitialized: false,
    cookie: {maxAge: 60000, secure: false}
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/', index);

//This receives the user from the database and prepares it to send to client.
//The user below is the user is the session user.  The user.id is what we get back from the database.
passport.serializeUser(function(user, done){
    done(null, user.id)
});

//This gets the id from the client and expands the data by using a database query.
passport.deserializeUser(function(id, done){
    pg.connect(connectionString, function(err, client){
        var user = {};

        var query = client.query('SELECT * FROM user_data WHERE id = $1', [id]);

        query.on('row', function(row){
            user = row;
            console.log('User object', user);
            done(null, user);
        });
    });
});

//Declaring local strategy that we named above.
passport.use('local', new localStrategy({
    passReqToCallback: true,
    usernameField: 'username'

}, function(req, username, password, done){
    //connect to database to authenticate/verify username and password.
    pg.connect(connectionString, function(err, client){
        var user = {};

        var query = client.query('SELECT * FROM user_data WHERE username = $1', [username]);

        query.on('row', function(row) {
            user = row;
            console.log('User object', user);
        });
        query.on('end', function(){
            if(user && user.password === password){
                done(null, user);
            } else {
                done(null, false, {message: 'Something is wrong.'});
            }
            client.end();
        });
    });

}));



var server = app.listen(3000, function(){
    var port = server.address().port;
    console.log('Listening on port', port);
});