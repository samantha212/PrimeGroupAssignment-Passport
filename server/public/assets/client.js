/**
 * Created by samanthamusselman on 1/26/16.
 */
var app = angular.module('myApp', []);

app.controller('mainController', function($scope, $http){
    $http.get('/getuser').then(function(response){
        console.log(response);
        $scope.data = response.data;
    });
});