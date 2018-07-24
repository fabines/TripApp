angular.module('tripApp').controller('indexCtrl', function ($scope, $http, $window) {
$scope.connected = window.sessionStorage.getItem('connected');

});