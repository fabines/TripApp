angular.module('tripApp')
    .controller('homeCtrl', function ($scope, $http, $window) {
        $scope.points = [];
        $scope.pop_points = [];
        $scope.favPoints = [];
        $scope.favPointIds = [];
        $scope.reviews = [];
        $scope.RecPoints = [];
        $scope.lastPoints = [];
        $scope.selectedPoint;
        $scope.color = "grey";
        $scope.FavCounter = $scope.favPointIds.length;
        $scope.token = window.sessionStorage.getItem('token');
        $scope.connected = window.sessionStorage.getItem('connected');

        $scope.userName = window.sessionStorage.getItem('userName');
        $scope.register = function () {
            $window.location.href = '#!/register';
        };

        $scope.forget=function(){
            $window.location.href='#!/forget'
        }


        $scope.GoToFavList = function(){
            $window.location.href = '/#!/favorite';
        }

        $scope.select = function (point) {
            $scope.selectedPoint = point;

            if($scope.favPointIds.includes($scope.selectedPoint.PointId)) $scope.color="red";
            else $scope.color="grey";
            $scope.Map($scope.selectedPoint.Coordinates, $scope.selectedPoint.Description);
            $scope.selectedPoint.ViewNum += 1;
            $http.post('Points/viewsInc/' + $scope.selectedPoint.PointId);
            $http.get(`Users/reviewPoint/${$scope.selectedPoint.PointId}`).then((res) => {
                $scope.commentText = "";
                $scope.reviews = [];

                $scope.reviews = res.data.response;

            });
        };

        $scope.addComment = function (e) {
            var payload = {
                Review: $scope.commentText,
                Username: $scope.userName,
                token: $window.sessionStorage.getItem('token')
            };
            $http.post(`Users/log/reviewPoint/${$scope.selectedPoint.PointId}`, JSON.stringify(payload))
                .then((res) => {
                    alert("Your message was submitted successfully" + res.data.response);
                }).catch((res) => {
                alert(res.data.response);
            });
        };

        $scope.change = function () {
            if (!$scope.connected) alert("You need to log in, in order to use this functionality!");
            else {
                if (!$scope.favPointIds.includes($scope.selectedPoint.PointId)) {

                    var url = `Users/log/insertFavourite/${$scope.userName}/point/${$scope.selectedPoint.PointId}`;
                    var options = {headers: {'Authorization': $scope.token}};
                    $http.post(url, "", options).then((response) => {
                        $scope.favPoints.push($scope.selectedPoint);

                        $scope.favPointIds.push($scope.selectedPoint.PointId);
                        $scope.FavCounter = $scope.favPointIds.length;
                        $scope.color="red";
                    }).catch((response) => {
                        alert(response.data.response);
                    });
                }
                else {

                    var payload = {
                        PointId: $scope.selectedPoint.PointId,
                        Username: $scope.userName,
                        token: window.sessionStorage.getItem('token')
                    }
                    var options = {headers: {'Authorization': $scope.token}};
                    $http.post('Users/log/removePoint', JSON.stringify(payload), options).then((response) => {
                        var index = $scope.favPoints.indexOf($scope.selectedPoint);
                        $scope.favPoints.splice(index, 1);
                        $scope.favPointIds.splice(index,1);
                        $scope.FavCounter = $scope.favPointIds.length;
                        $scope.color="grey";
                    }).catch((res) => {
                        alert("Error removing point " + res.data.response);
                    });
                }
            }
        };

        $scope.setFavPoints = function() {

            var payload = {
                token: window.sessionStorage.getItem('token')
            }
            $http.post(`/Users/log/getFavourite/${$scope.userName}`, JSON.stringify(payload)).then((response) => {
                if(response.data.status=="failed"){
                    alert(response.data.response)
                }
                else {
                    $scope.favPoints = response.data.response.map(favp => $scope.points.find(p => p.PointId == favp.PointId));
                    $scope.favPointIds = $scope.favPoints.map(favp => favp.PointId);
                    $scope.FavCounter = $scope.favPointIds.length;


                    $scope.lastPoints = $scope.favPoints.sort((a, b) => b.id - a.id).splice(0, 2);
                    $scope.RecoPoints();
                }
            }).catch((res) => {
                alert("ERROR loading user favorites "+res);
            });
        }

        $scope.login = function () {
            var payload = {
                Username: $scope.username,
                Password: $scope.password
            };
            $http.post('Users/login', JSON.stringify(payload)).then((response) => {
                const {success = false, token} = response.data;
                if (success) {

                    window.sessionStorage.setItem('token', token);
                    window.sessionStorage.setItem('connected', 'true');
                    window.sessionStorage.setItem('userName', $scope.username);
                    $scope.userName = $scope.username;
                    $scope.connected = true;
                    $scope.token = token;
                    $scope.setFavPoints();
                    //$scope.RecoPoints();
                    $('.register').hide();




                } else {
                    alert(response.data.response);
                }
            });

        };

        var getPointsByCategories = function (i) {
            $http.get('Points/category/' + i)
                .then(function (response) {
                    $scope.points[i - 1] = response.data.response;
                })
        };
//rate

        $scope.SaveChanges = function(){
            if($scope.rate){

                var payload = {
                    Username : $scope.userName,
                    Rate : $scope.rate
                };
                $http.post(`Users/ratePoint/${$scope.selectedPoint.PointId}`,JSON.stringify(payload)).then(()=>{
                    $http.post(`Points/rate/${$scope.selectedPoint.PointId}`).then((res)=>{
                        alert("calculation done"+ res.data.response);
                    })
                   alert("thank you for rating, changes saved");
                    $scope.reviews = [];
                });
            }
        }
//map

        $scope.Map = function(coordinates, desc){

            mapboxgl.accessToken = 'pk.eyJ1IjoiZXN0aWZhYmluIiwiYSI6ImNqang4MWVqMzJtZmszcm1haHZ2YnE3ZW4ifQ.j1oCmbRDDZH46yJhQH39bg';

            var coordinatesArr = coordinates.split(',');
            var coordinateEast = parseFloat(coordinatesArr[0]);
            var coordinateNorth = parseFloat(coordinatesArr[1]);

            var monument = [coordinateNorth , coordinateEast]; //change to coordinates from server
            //var coordinates = document.getElementById('coordinates');
            var map = new mapboxgl.Map({
                container: 'map',
                style: 'mapbox://styles/mapbox/streets-v9',
                center: monument,
                zoom: 15
            });
            var popup = new mapboxgl.Popup({ offset: 25 })
                .setText(desc);

            var el = document.createElement('div');
            el.id = 'marker';

            new mapboxgl.Marker(el)
                .setLngLat(monument)
                .setPopup(popup) // sets a popup on this marker
                .addTo(map);
        }


//get recommended points using most rated points by usercategories
        $scope.RecoPoints = function () {

            var options = {headers: {'Authorization': $scope.token}};
            $http.get(`Users/log/categories/${$scope.userName}`, options).then((res) => {
                var categories = res.data.response.map(cat => cat.CategoryId);
                $http.get(`Points/category/${categories[0]}`).then((res) => {
                    var points = res.data.response.filter(p=>!$scope.favPointIds.includes(p.PointId));
                    points = points.sort(function(a,b){return b.RateInPrec - a.RateInPrec});
                    $scope.RecPoints.push(points[0]);

                });
                $http.get(`Points/category/${categories[1]}`).then((res) => {
                    var points = res.data.response.filter(p=>!$scope.favPointIds.includes(p.PointId));
                    points = points.sort(function(a,b){return b.RateInPrec - a.RateInPrec});
                    $scope.RecPoints.push(points[0]);

                });
                //test

            }).catch((res) => {
                alert("ERROR loading user categories "+res);
            });
        };

//get last saved points by largest Id in database.



        //do every refresh
        function getPoints(){
            $http.get('Points/getPoints').then(function (response) {
                $scope.pop_points = response.data.response.filter((point) => point.RateInPrec >= 30);
                $scope.points = response.data.response.filter((point)=> point.RateInPrec >=0);
                r = Math.floor(Math.random() * ($scope.pop_points.length - 2));

                $scope.pop_points = $scope.pop_points.slice(r, r + 3);
            });
        }
        //update points

        if($scope.connected){
            //$scope.userName = window.sessionStorage.getItem('userName');
            $http.get('Points/getPoints').then(function (response) {
                $scope.pop_points = response.data.response.filter((point) => point.RateInPrec >= 30);
                $scope.points = response.data.response.filter((point)=> point.RateInPrec >=0);
                r = Math.floor(Math.random() * ($scope.pop_points.length - 2));
                //$scope.pop_points = $scope.pop_points.slice(r, r + 3);
            }).then((res)=>{


                $scope.setFavPoints();
            });

        }else {
            $http.get('Users').then(function (response) {
                $scope.users = response.data.response
            });
            getPoints();
        }


        $scope.signOut =function(){
            window.sessionStorage.clear();
            $window.location.href = '/#!/about';
            $window.location.href = '/#!/home';
        };
    });