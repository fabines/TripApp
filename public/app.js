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
        when('/todo', {
            templateUrl: 'components/todo/todo-view.html',
            controller: 'todoCtrl'
        }).
        when('/register', {
            templateUrl: 'components/register/register-view.html',
            controller: 'registerCtrl'
        }).
        when('/about', {
            templateUrl: 'components/about/about-view.html',
            controller: 'aboutCtrl'
        }).
        otherwise({
            redirectTo: '/home'
        });
    }]);



app.controller('indexController', [function() {
    var vm = this;
    vm.name = 'Esti';
}]);