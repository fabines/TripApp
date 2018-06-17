angular.module('tripApp')
    .controller('registerCtrl', function ($scope,$http,$window) {

        $scope.user = {};
        $scope.status = "";
        $scope.loading = true;
        $scope.xml = "";
        $scope.countries = [];
        $scope.categories = [{name: "מוזיאונים", id: 1}, {name: "סיורים", id: 2}, {
            name: "חיי לילה",
            id: 3
        }, {name: "אטרקציות", id: 4}];
        $scope.questions = ["What's your pet's name", "What's your mother's birthday", "What's your best friend's name"];
        $http.get("/assets/countries.xml").then(function (res) {
            $scope.xml = res.data.toString();
            parser = new DOMParser();
            doc = parser.parseFromString($scope.xml, "text/xml");
            countries = doc.getElementsByTagName("Country");
            for (var i = 0; i < countries.length; i++) $scope.countries.push(countries[i].getElementsByTagName("Name")[0].innerHTML)
        });


        $scope.submitForm = function () {
            $scope.loading = true;
            var json = JSON.stringify({
                FirstName: $scope.user.firstname,
                LastName: $scope.user.lastname,
                City: $scope.user.city,
                Country: $scope.user.country,
                Email: $scope.user.email,
                Username: $scope.user.username,
                Password: $scope.user.password
            });
            var secretQuestion = {
                Question1: $scope.user.question1,
                Question2: $scope.user.question2,
                Ans1: $scope.user.answer1,
                Ans2: $scope.user.answer2,
            };
            $http.post('Users/register', json)
                .then(function (response) {
                    $http.post('/Users/answerQues/'+$scope.user.username, JSON.stringify(secretQuestion))
                        .then((qResponse) => {
                            $scope.status = true;
                            $scope.loading = false;
                            $window.location.href = '/#!/home';

                        });
                }).catch(() => {
                alert("Error!")
                $scope.status = false;
            });


        }
    });