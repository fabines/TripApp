angular.module('tripApp')
    .controller('favoriteCtrl', function ($scope, $http, $window) {

        $scope.user = window.sessionStorage.getItem("userName");
        $scope.token = window.sessionStorage.getItem("token")
        $scope.connect = checkConnection();
        $scope.favorites = []
        //by pointId
        $scope.selectedPoint = ""
        $scope.poi = [];
        var options = {};
        $scope.chooseSort = false;
        $scope.counter = 1;
        $scope.showMySort = false;
        $scope.primarySort = true;
        $scope.myPointSort = [];
        $scope.finishDis = true;
        $scope.lastPoints = [];






        function checkConnection() {
            if ($scope.user != null && $scope.token != null) {
                return true;
            }
            else {
                return false;
            }
        }



        //only if the user connect
        if ($scope.connect) {
            //alert("next"+$scope.options.headers.Authorization)
            setFavorite();
        }

        function setFavorite() {
            $http.get("/Points/getPoints").then(function (response) {
                $scope.poi = response.data.response;
                options = { headers: { 'Authorization': $scope.token } };
                $http.post(`Users/log/getFavourite/${$scope.user}`, "", options).then(function (response) {

                    $scope.favorites = response.data.response;
                    //join the favorite table with the points table
                    for (var i = 0; i < $scope.poi.length; i++) {
                        for (var j = 0; j < $scope.favorites.length; j++) {
                            if ($scope.poi[i].PointId == $scope.favorites[j].PointId) {
                                $http.post("/Points/rate/" + $scope.poi[i].PointId).then(function (res) {
                                });

                                $scope.favorites[j].PointName = $scope.poi[i].PointName;
                                $scope.favorites[j].CatgoryName = $scope.poi[i].CatgoryName;
                                $scope.favorites[j].RateInPrec = $scope.poi[i].RateInPrec;
                                $scope.favorites[j].Picture = $scope.poi[i].Picture;
                                $scope.favorites[j].Coordinates=$scope.poi[i].Coordinates;
                                $scope.favorites[j].Description=$scope.poi[i].Description;
                                $scope.favorites[j].ViewNum=$scope.poi[i].ViewNum;
                                $scope.favorites[j].disableSort = true;
                                $scope.favorites[j].sortCounter = 0;


                            }
                        }
                    }
                });
            });
        }

        $scope.Mysort = function (p) {
            for (var i = 0; i < $scope.favorites.length; i++) {
                $scope.favorites[i].disableSort = false;
                // alert($scope.favorites[i].disableSort)
            }
            $scope.chooseSort = true;
            $scope.counter = 1;
            // $scope.finishDis=true;


            //$scope.pointSort=$scope.favorites;

        }

        //the sorting process
        $scope.selectSort = function (p) {
            // alert(p.PointId)
            //$scope.counter = 1;
            //finding the position of the point at the favorites array
            //  if ($scope.primarySort) {
            var pos = $scope.favorites.map(function (e) { return e.PointId; }).indexOf(p.PointId);
            $scope.favorites[pos].disableSort = true;
            $scope.favorites[pos].sortCounter = $scope.counter;
            $scope.counter++;
            //  }
            //  else if($scope.showMySort){
            // var pos = $scope.myPointSort.map(function (e) { return e.PointId; }).indexOf(p.PointId);
            // $scope.myPointSort[pos].disableSort = true;
            // $scope.myPointSort[pos].sortCounter = $scope.counter;
            // $scope.counter++;
            //  }
            if ($scope.counter - 1 == $scope.favorites.length) {
                //$scope.finishDis=false;
                for (var i = 0; i < $scope.favorites.length; i++) {
                    if ($scope.favorites[i].sortCounter < 0) {
                        $scope.favorites[i].sortCounter = $scope.counter;
                        $scope.counter++;
                    }
                    var data = {
                        Username: $scope.user,
                        PointId: $scope.favorites[i].PointId,
                        Counter: $scope.favorites[i].sortCounter

                    }
                    $scope.favorites[i].disableSort = false;
                    //insert to the db the sorting
                    $http.put(`/Users/log/UserSort`, JSON.stringify(data), options).then(function (res) {
                        if (res.data.response == "failed") {
                            alert("Problem with the sorting.")
                        }
                    });
                    setFavorite();

                }
            }


            //alert(pos);

        }

        // $scope.finishSort = function () {
        //     //$scope.favorites=[];
        //     //alert($scope.favorites[0].PointId);

        //         // for (var i = 0; i < $scope.favorites.length; i++) {
        //         //     if ($scope.favorites[i].sortCounter < 0) {
        //         //         $scope.favorites[i].sortCounter = $scope.counter;
        //         //         $scope.counter++;
        //         //     }
        //         //     var data = {
        //         //         Username: $scope.user,
        //         //         PointId: $scope.favorites[i].PointId,
        //         //         Counter: $scope.favorites[i].sortCounter

        //         //     }
        //         //     $scope.favorites[i].disableSort = false;
        //         //     //insert to the db the sorting
        //         //     $http.put(`/Users/log/UserSort`, JSON.stringify(data), options).then(function (res) {
        //         //         if (res.data.response == "failed") {
        //         //             alert("Problem with the sorting.")
        //         //         }
        //         //     });
        //         // }


        //     $scope.chooseSort = false;
        //     setFavorite();
        //     var pos = 0;
        //     // $scope.showMySort = true;
        //     // $scope.primarySort = false;
        //     //alert($scope.favorites.length)
        //     for (var i = 0; i < $scope.favorites.length; i++) {
        //         pos = $scope.favorites[i].MySort;
        //         //alert(pos);
        //         $scope.myPointSort[pos - 1] = $scope.favorites[i];
        //         //$scope.myPointSort[pos - 1].sortCounter = 0;

        //     }
        //     for (var i = 0; i < $scope.myPointSort.length; i++) {
        //         $scope.favorites[i]=$scope.myPointSort[i];
        //         // alert($scope.favorites[i].PointId)
        //         // alert($scope.myPointSort[i].PointId)
        //     }
        //     alert("hhhh")


        // }

        // $scope.showSort = function () {
        //     $scope.chooseSort = false;
        //     // setFavorite();
        //     // var pos = 0;
        //     // // $scope.showMySort = true;
        //     // // $scope.primarySort = false;
        //     // //alert($scope.favorites.length)
        //     // for (var i = 0; i < $scope.favorites.length; i++) {
        //     //     pos = $scope.favorites[i].MySort;
        //     //     //alert(pos);
        //     //     $scope.myPointSort[pos - 1] = $scope.favorites[i];
        //     //     //$scope.myPointSort[pos - 1].sortCounter = 0;

        //     // }
        //     // for (var i = 0; i < $scope.myPointSort.length; i++) {
        //     //     $scope.favorites[i]=$scope.myPointSort[i];
        //     //     alert($scope.favorites[i].PointName);
        //     //     // alert($scope.favorites[i].PointId)
        //     //     // alert($scope.myPointSort[i].PointId)
        //     // }
        //     // alert("hhhh")
        //     //$scope.sortBy(MySort);




        // }

        // $scope.watch = function (p) {
        //     alert("dddd")

        //     $scope.selectedPoint = p;
        //     pointService.set($scope.selectedPoint);
        //         $window.location.href='#!/modal'


        //     alert($scope.selectedPoint.PointName)


        // }

        $scope.delete = function (p) {
            $scope.selectedPoint = p;

            var payload = {
                PointId: $scope.selectedPoint.PointId,
                token: $scope.token
            }

            $http.delete(`Users/log/removePoint/${$scope.user}/${$scope.selectedPoint.PointId}`, options).then(function (res) {
                alert($scope.user)
                alert($scope.selectedPoint.PointId)
                //if didn't remove the point
                if (res.data.status == "failed") {
                    alert(res.data.rsesponse);
                }
                else {
                    $scope.favorites = [];
                    $scope.poi = [];
                    //update the new point of favorite
                    setFavorite()

                }
            });


        }
        // alesrt($scope.favorites[0].CatgoryName)

        $scope.propertyName = 'Category';
        $scope.propertyName = '';

        $scope.reverse = true;

        $scope.sortBy = function (propertyName) {
            $scope.finishDis = true;
            $scope.reverse = ($scope.propertyName === propertyName) ? !$scope.reverse : false;
            $scope.propertyName = propertyName;
        };

        /////modal///////////

        $scope.points = [];
        $scope.pop_points = [];
        $scope.favPoints = [];
        $scope.favPointIds = [];
        $scope.reviews = [];
        $scope.RecPoints = [];
        $scope.lastPoints = [];
        $scope.color = "red";
        $scope.FavCounter = $scope.favPointIds.length;
        $scope.token = window.sessionStorage.getItem('token');
        $scope.connected = window.sessionStorage.getItem('loggedIn');

        $scope.userName = window.sessionStorage.getItem('userName');

        $scope.select = function (p) {
            $scope.selectedPoint = p;
            // alert($scope.selectedPoint.PointId)
            // alert("Selected: "+$scope.selectedPoint.PointId+" name: "+$scope.selectedPoint.PointName + "coordinates: "+$scope.selectedPoint.Coordinates);
            // if($scope.favorites.PointId.includes($scope.selectedPoint.PointId)) $scope.color="red";
            // else $scope.color="grey";
            Map($scope.selectedPoint.Coordinates, $scope.selectedPoint.Description)
            // $scope.Map($scope.selectedPoint.Coordinates, $scope.selectedPoint.Description);
            $scope.selectedPoint.ViewNum += 1;

            $http.post('Points/viewsInc/' + $scope.selectedPoint.PointId);

            $http.get(`Users/reviewPoint/${$scope.selectedPoint.PointId}`).then((res) => {
                $scope.commentText = "";
                $scope.reviews = [];
                $scope.reviews = res.data.response;
                // alert($scope.reviews.map(r=>r.Username));
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

        // $scope.change = function () {
        //     if (!$scope.connected) alert("You need to log in, in order to use this functionality!");
        //     else {
        //         if (!$scope.favorites.PointId.includes($scope.selectedPoint.PointId)) {
        //             // alert("in add")
        //             var url = `Users/log/insertFavourite/${$scope.username}/point/${$scope.selectedPoint.PointId}`;
        //             var options = { headers: { 'Authorization': $scope.token } };
        //             $http.post(url, "", options).then((response) => {
        //                 $scope.favorites.push($scope.selectedPoint);
        //                 $scope.favorites.PointId.push($scope.selectedPoint.PointId);
        //                 $scope.FavCounter = $scope.favPointIds.length;
        //                 $scope.color = "red";
        //             }).catch((response) => {
        //                 alert(response.data.response);
        //             });
        //         }
        //         else {
        //             // alert("deleting "+$scope.selectedPoint.PointId);
        //             var payload = {
        //                 PointId: $scope.selectedPoint.PointId,
        //                 Username: $scope.userName,
        //                 token: window.sessionStorage.getItem('token')
        //             }
        //             var options = { headers: { 'Authorization': $scope.token } };
        //             $http.post('Users/log/removePoint', JSON.stringify(payload), options).then((response) => {
        //                 var index = $scope.favPoints.indexOf($scope.selectedPoint);
        //                 $scope.favPoints.splice(index, 1);
        //                 $scope.favPointIds.splice(index, 1);
        //                 $scope.FavCounter = $scope.favPointIds.length;
        //                 $scope.color = "grey";
        //             }).catch((res) => {
        //                 alert("Error removing point " + res.data.response);
        //             });
        //         }
        //     }
        // };



        //rate

        $scope.SaveChanges = function () {
            if ($scope.rate) {
                // alert($scope.rate);
                var payload = {
                    Username: $scope.userName,
                    Rate: $scope.rate
                };
                $http.post(`Users/ratePoint/${$scope.selectedPoint.PointId}`, JSON.stringify(payload)).then(() => {
                    $http.post(`Points/rate/${$scope.selectedPoint.PointId}`).then((res) => {
                        // alert("calculation done"+ res.data.response);
                    })
                    alert("thank you for rating, changes saved");
                });
            }
        }
        //map

            function Map(coordinates, desc){

            mapboxgl.accessToken = 'pk.eyJ1IjoiZXN0aWZhYmluIiwiYSI6ImNqang4MWVqMzJtZmszcm1haHZ2YnE3ZW4ifQ.j1oCmbRDDZH46yJhQH39bg';
            // alert("coordinates: "+coordinates);
            var coordinatesArr = coordinates.split(',');
            var coordinateEast = parseFloat(coordinatesArr[0]);
            var coordinateNorth = parseFloat(coordinatesArr[1]);
            // alert("North: "+typeof (coordinateNorth) + "North= "+ coordinateNorth+ "East: "+typeof (coordinateEast) + "East= "+ coordinateEast)
            var monument = [coordinateNorth, coordinateEast]; //change to coordinates from server
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
        // $scope.RecoPoints = function () {
        // function RecoPoints() {
        //     alert("in func");
        //     var options = { headers: { 'Authorization': $scope.token } };
        //     $http.get(`Users/log/categories/${$scope.userName}`, options).then((res) => {
        //         var categories = res.data.response.map(cat => cat.CategoryId);
        //         $http.get(`Points/category/${categories[0]}`).then((res) => {
        //             var points = res.data.response.filter(p => !$scope.favPointIds.includes(p.PointId));
        //             points = points.sort(function (a, b) { return b.RateInPrec - a.RateInPrec });
        //             $scope.RecPoints.push(points[0]);

        //         });
        //         $http.get(`Points/category/${categories[1]}`).then((res) => {
        //             var points = res.data.response.filter(p => !$scope.favPointIds.includes(p.PointId));
        //             points = points.sort(function (a, b) { return b.RateInPrec - a.RateInPrec });
        //             $scope.RecPoints.push(points[0]);

        //         });
        //         //test

        //     }).catch((res) => {
        //         alert("ERROR loading user categories " + res);
        //     });
        // };

        //get last saved points by largest Id in database.



        //do every refresh
        // function getPoints() {
        //     $http.get('Points/getPoints').then(function (response) {
        //         $scope.pop_points = response.data.response.filter((point) => point.RateInPrec >= 30);
        //         $scope.points = response.data.response.filter((point) => point.RateInPrec >= 0);
        //         r = Math.floor(Math.random() * ($scope.pop_points.length - 2));

        //         $scope.pop_points = $scope.pop_points.slice(r, r + 3);
        //     });
        // }
        //update points

        // if ($scope.connected) {
        //     //$scope.userName = window.sessionStorage.getItem('userName');
        //     $http.get('Points/getPoints').then(function (response) {
        //         $scope.pop_points = response.data.response.filter((point) => point.RateInPrec >= 30);
        //         $scope.points = response.data.response.filter((point) => point.RateInPrec >= 0);
        //         r = Math.floor(Math.random() * ($scope.pop_points.length - 2));
        //         //$scope.pop_points = $scope.pop_points.slice(r, r + 3);
        //     }).then((res) => {
        //         // alert($scope.points.map(p=>p.PointId));

        //         $scope.setFavPoints();
        //     });

        // } else {
        //     $http.get('Users').then(function (response) {
        //         $scope.users = response.data.response
        //     });
        //     getPoints();
        // }








    });