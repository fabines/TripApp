var app = angular.module('tripApp', ["ngRoute"]);

app.config(['$routeProvider',
    function (
        $routeProvider
    ) {
        $routeProvider.
        when('/home', {
            templateUrl: 'components/home/home-view.html',
            controller: 'homeCtrl'
        }).
        when('/forget',{
            templateUrl:'components/forgotPassword/forgotPassword-view.html',
            controller:'forgetCtrl'
        }).
        when('/points', {
            templateUrl: 'components/points/points-view.html',
            controller: 'pointsCtrl'
        }).
        when('/register', {
            templateUrl: 'components/register/register-view.html',
            controller: 'registerCtrl'
        }).
        when('/about', {
            templateUrl: 'components/about/about-view.html',
            controller: 'aboutCtrl'
        }).
        when('/favorite',{
            templateUrl: 'components/favorite/favorite-view.html',
            controller: 'favoriteCtrl'
        }).
        otherwise({
            redirectTo: '/home'
        });
    }]);



app.controller('indexController', [function() {
    var vm = this;
    vm.name = 'Esti';
}]);