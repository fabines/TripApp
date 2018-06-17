angular.module('tripApp')
    .controller('homeCtrl', function ($scope,$http,$window) {
        $scope.name="guest";
        $scope.points = [];
        $scope.pop_points = [];
        $scope.selected = 0;
        $scope.color = "grey";
        $scope.hideLogin = window.sessionStorage.getItem('loggedIn');
        $scope.userName = window.sessionStorage.getItem('userName');
        $scope.register = function () {
            $window.location.href = '#!/register';
        };

        $scope.select = function(id){
            $scope.selected = id;
            $scope.pop_points[id].ViewNum+=1;
            $scope.selectedPoint = $scope.pop_points[id].PointId;
            $http.post('Points/viewsInc/'+$scope.selectedPoint);
        };

        $scope.addComment = function(e){
          var payload = {
              Review: $scope.commentText,
              Username: $scope.userName
          }
          $http.post(`Users/log/reviewPoint/${$scope.selectedPoint}`, JSON.stringify(payload))
              .then(() => {
                  alert("Your message was submitted successfully");
              }).catch(() => {
                  alert("ERROR");
              });
        };

        $scope.change = function(){
            if($scope.color === "grey") $scope.color="red";
            else $scope.color="grey";
        };

        $scope.login = function(){
            var payload = {
                Username: $scope.username,
                Password: $scope.password
            };
            $http.post('Users/login', JSON.stringify(payload)).then((response) => {
                const {success = false, token} = response.data;
                if(success){
                    window.sessionStorage.setItem('token', token);
                    window.sessionStorage.setItem('loggedIn', true);
                    window.sessionStorage.setItem('userName', $scope.username);
                    $scope.userName = $scope.username;
                    $scope.hideLogin = true;
                } else {
                    alert(response.data.response);
                }
            });

        }



        $http.get('Users')
            .then(function (response) {$scope.users = response.data.response});

        var getPointsByCategories = function (i) {
            $http.get('Points/category/'+i)
                .then(function (response) {
                    $scope.points[i-1]=response.data.response;
                })
        }

        $http.get('Points/getPoints').then(function (response) {
            $scope.pop_points=response.data.response.filter((point) => point.RateInPrec >= 1);
            r = Math.floor(Math.random()*$scope.pop_points.length-2);
            //$scope.pop_points=$scope.points.slice(r,r+3);
        })

    });