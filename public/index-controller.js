angular.module('tripApp').controller('indexCtrl', function ($scope, $http, $window) {
    $scope.connected = window.sessionStorage.getItem('loggedIn');
    if($scope.connected==null) $scope.connected=false;

});