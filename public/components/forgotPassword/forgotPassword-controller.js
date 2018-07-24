angular.module('tripApp')
    .controller('forgetCtrl', function ($scope, $http, $window) {
        $scope.UserQuestins = [];
        $scope.pass;
        $scope.IsVisible = false;
        $scope.showpassword=false;
        $scope.trueAns=false;
        $scope.ShowHide = function () {

            //If DIV is visible it will be hidden and vice versa.
            $scope.IsVisible = $scope.IsVisible ? false : true;
            var username = {
                Username: $scope.username
            };
            $http.post('/Users/username', username)
                .then(function (respone) {
                    if (respone.data.status == "failed") {
                        alert(respone.data.response);
                        return;
                    }
                    else {
                        $scope.pass=respone.data.response[0].Password;
                        $http.post('/Users/userQuestions', username)
                            .then(function (respone1) {
                                if (respone1.data.status == "failed") {
                                    alert(respone.data.respone);
                                    return;
                                }
                                else {
                                    for (var i = 0; i < 2; i++) {
                                        $scope.UserQuestins[i] = respone1.data.response[i].Question;
                                    }
                                }
                            });
                        }
                    });
                }

                $scope.CheckPass=function(){
                    var ans={
                        Username:$scope.username,
                        Question:$scope.user.question,
                        Ans:$scope.user.answer
                    }
                    $http.post('/Users/restorePass',ans)
                    .then(function(response2){
                        if(response2.data.status=="failed"){
                            alert("Incorrect answer")
                            alert(respone.data.respone);
                            return;
                        }
                        else{
                            ShowPass();
                        }
                    }, function (response) {
                        //self.submitForm.content = response.data
                        alert("Error")

                        //Second function handles error
                        // self.reg.content = "Something went wrong";
                    });
            }

            function ShowPass(){
                $scope.showpassword=$scope.showpassword ? false : true;
            }


                    

    });
