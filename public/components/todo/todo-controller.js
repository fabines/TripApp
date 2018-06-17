angular.module('tripApp')
    .controller('todoCtrl', function ($scope) {

        $scope.name = "Sharon";
        $scope.products = ["task1", "task2", "task3"];
        $scope.addItem = function () {
            $scope.errortext = "";
            if (!$scope.addMe) {return;}
            if ($scope.products.indexOf($scope.addMe) == -1) {
                $scope.products.push($scope.addMe);
            } else {
                $scope.errortext = "The item is already in your todo list.";
            }

        }
        $scope.removeItem = function (x) {
            $scope.errortext = "";
            $scope.products.splice(x, 1);
        }

    });