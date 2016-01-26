/**
 * Created by samanthamusselman on 1/26/16.
 */
var express = require('express');
var path = require('path');
var passport = require('passport');
var router = express.Router();


router.get('/', function(request, response){
   response.sendFile(path.join(__dirname, '../public/views/index.html'));
});

router.get('/loginfail', function(request, response){
    response.sendFile(path.join(__dirname, '../public/views/loginfail.html'));
});

router.get('/userhomepage', function(request, response){
    response.sendFile(path.join(__dirname, '../public/views/userhomepage.html'));
});

router.get('/getuser', function(request, response){
    response.send(request.user);
});

//This is going to receive the login request and check with passport middleware.
router.post('/', passport.authenticate('local', {
    successRedirect: '/userhomepage',
    failureRedirect: '/loginfail'
}));

module.exports = router;