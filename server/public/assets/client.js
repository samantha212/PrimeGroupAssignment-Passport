/**
 * Created by samanthamusselman on 1/26/16.
 */
var app = angular.module('myApp', []);

app.controller('userHomePageController', function($scope, $http){
    $http.get('/getuser').then(function(response){
        console.log(response);
        $scope.data = response.data;
    });

    $scope.makePayment = function(loanType, paymentAmount){
        var paymentInfo = {
            loanType: loanType,
            paymentAmount: paymentAmount
        };

        console.log(paymentInfo);

        $http.post('/makepayment', paymentInfo).success(function(response){
            console.log('Response', response);
        })
    }
});