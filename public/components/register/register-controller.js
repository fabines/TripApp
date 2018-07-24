angular.module('tripApp')
    .controller('registerCtrl', function ($scope, $http, $window) {

        $scope.user = {};
        $scope.status = "";
        $scope.loading = true;
        $scope.xml = "";
        $scope.countries = [];
        $scope.categories = [];
        // $scope.categories = [{ name: "מוזיאונים", id: 1 }, { name: "סיורים", id: 2 }, {
        //     name: "חיי לילה",
        //     id: 3
        // }, { name: "אטרקציות", id: 4 }];
        $scope.questions = []
        $scope.questionsName = []

        //$scope.questions = ["Whats your pets name", "Whats your mothers birthday month", "Whats your best friends name"];
        $http.get("/assets/countries.xml").then(function (res) {
            $scope.xml = res.data.toString();
            parser = new DOMParser();
            doc = parser.parseFromString($scope.xml, "text/xml");
            countries = doc.getElementsByTagName("Country");
            for (var i = 0; i < countries.length; i++) $scope.countries.push(countries[i].getElementsByTagName("Name")[0].innerHTML)
        });

        $http.get("/Points/categories").
            then(function (response) {
                $scope.categories = response.data.response;
            });

        $http.get("/Users/Questions").
            then(function (response2) {
                $scope.questions = response2.data.response;
                for (var i = 0; i < $scope.questions.length; i++)
                    $scope.questionsName[i] = ($scope.questions[i].Question)
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

            let secretQuestion = {
                Question1: $scope.user.question1,
                Question2: $scope.user.question2,
                Ans1: $scope.user.answer1,
                Ans2: $scope.user.answer2
            };


            var catSelected = {
                Cat1: $scope.user.selected_categories[0],
                Cat2: $scope.user.selected_categories[1],
                Cat3: $scope.user.selected_categories[2],
                Cat4: $scope.user.selected_categories[3]
            };





            //$scope.valid = false;
            //while (!$scope.valid) {
            let size = 0;
            for (var propt in catSelected) {
                if (catSelected[propt] == true) {
                    size++;

                }
            }
            if(!$scope.user.firstname || !$scope.user.lastname || !$scope.user.city || !$scope.user.country || !$scope.user.email || !$scope.user.username || !$scope.user.password ||!$scope.user.question1 || !$scope.user.answer1 || !$scope.user.question2 || !$scope.user.answer2){
                alert("Please fill all the fields")
            }
            else if(!(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test($scope.user.email))){
                alert("The Email illegal");
            }
            else if ($scope.user.username.length < 3 || $scope.user.username.length > 8)
                alert("Username length must be bigger than 2 and less than 9.")
            else if (!(/^[a-zA-Z]+$/.test($scope.user.username))) {
                alert("Username should contain only letters.")
            }
            else if (!(/^[a-zA-Z0-9]+$/.test($scope.user.password))  || $scope.user.password.length <= 4 || $scope.user.password.length >= 11)
                // alert("password should contain only letters & numbers  and the length should be between 5-10 characters");
                alert("The password length should be between 5-10 characters");
            // else if( ! ((?=.*?[0-9].test($scope.user.password) ) ){

            // }
            //at least one char and one num
            else if(!(/^.*(?=.{5,10})(?=.*\d)(?=.*[a-zA-Z]).*$/.test($scope.user.password))){
                alert("The password should contain at least one char and one digit.")

            }
            else if ($scope.user.question1 === $scope.user.question2) {
                alert("Please select different questions");
            }
            else if(size < 2) {
                alert("Please choose at least 2 categories." + size)
            }

            // }
            else {
                $http.post('/Users/register', json)
                    .then(function (response) {
                        if (response.data.status == "failed") {
                            alert(response.data.response);
                            return;
                        }

                        //First function handles success
                        $http.post('/Users/answerQues/' + $scope.user.username, secretQuestion)
                            .then(function (response1) {
                                if (response1.data.status == "failed") {
                                    alert(response1.data.response)
                                    return;
                                }

                                //First function handles success
                                $http.post('/Users/chooseCategories/' + $scope.user.username, catSelected)

                                    .then(function (response2) {
                                        if (response2.data.status == "failed") {
                                            alert(response2.data.response)
                                            return;
                                        }
                                        else {
                                            $scope.status = true;
                                            $scope.loading = false;
                                            $window.location.href = '/#!/home';
                                        }
                                        //First function handles success
                                        //self.submitForm.content = response.data


                                    }, function (response) {
                                        //self.submitForm.content = response.data
                                        alert("Error")

                                        //Second function handles error
                                        // self.reg.content = "Something went wrong";
                                    });
                            }, function (response1) {
                                //self.submitForm.content = response.data
                                //alert(response1.data.response)

                                //Second function handles error
                                // self.reg.content = "Something went wrong";
                            });
                    }, function (response2) {
                        //self.submitForm.content = response.data
                        alert(response2.data.response)
                        //Second function handles error
                        // self.reg.content = "Something went wrong";
                    });



            }
        }

    });