/**
 * Created by samanthamusselman on 1/26/16.
 */
var express = require('express');
var path = require('path');
var passport = require('passport');
var router = express.Router();
var pg = require('pg');
var bodyParser = require('body-parser');

var connectionString = 'postgres://localhost:5432/group_passport';


router.get('/', function(request, response){
   response.sendFile(path.join(__dirname, '../public/views/index.html'));
});

router.get('/loginfail', function(request, response){
    response.sendFile(path.join(__dirname, '../public/views/loginfail.html'));
});

router.get('/userhomepage', function(request, response){
    response.sendFile(path.join(__dirname, '../public/views/userhomepage.html'));
});

router.post('/makepayment', function(request, response){
    var resultsArray = [];
    var loanType = request.body.loanType;
    var paymentAmount = request.body.paymentAmount;


    console.log('Payment route hit with this info', loanType, paymentAmount);
    pg.connect(connectionString, function(err, client, done) {
        //client.query('UPDATE user_data SET ' + loanType + ' = ' + loanType + ' - ' + paymentAmount + ' WHERE  id = ' + request.user.id);
        //client.query('UPDATE user_data SET $1 = ' + loanType + ' - ' + paymentAmount + ' WHERE  id = ' + request.user.id, [loanType]);
        if (loanType = "car_loan") {
            client.query('UPDATE user_data SET car_loan = car_loan - $1 WHERE id = $2', [paymentAmount, request.user.id]);
        } else {
            client.query('UPDATE user_data SET home_loan = home_loan - $1 WHERE id = $2', [paymentAmount, request.user.id]);

        }

        //client.query('UPDATE user_data SET $1 = $2 WHERE id = $3', [loanType, loanType - paymentAmount, request.user.id]);
        //client.query('UPDATE user_data SET car_loan = car_loan - 800 WHERE  id = 251');


        var query = client.query('SELECT * FROM user_data WHERE id = $1', [request.user.id]);

        query.on('row', function(row){
            resultsArray.push(row);
        });
        query.on('end', function(){
            console.log(resultsArray);
            client.end();
            return response.json(resultsArray);
        });

        if(err) {
            console.log('Error', err);
        }
    })
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