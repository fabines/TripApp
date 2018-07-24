angular.module('tripApp').controller('pointsCtrl', function ($scope, $http, $window) {
    $scope.connected = window.sessionStorage.getItem('connected');
    $scope.userName = window.sessionStorage.getItem('userName');
    $scope.points = [];
    $scope.view_points = [];
    $scope.categories = [];
    $scope.selectedPoint;
    $scope.favPoints = [];
    $scope.favPointIds = [];
    $scope.selected = [false,false,false,false];
    $scope.rateSort = false;
    $scope.pointSort = false;
    $scope.searched = null;
    $scope.searchText = "";
    $scope.FavCounter = $scope.favPointIds.length;
    $scope.reviews = [];

    $scope.search = function () {
        $scope.pointSort=true;
        $scope.searched = null;
        $scope.searched = $scope.points.find(p=>p.PointName===$scope.searchText);
        if($scope.searched === undefined){
            alert("no Points found please try again+ "+ $scope.searched);
            $window.location.href = '/#!/about';
            $window.location.href = '/#!/points';

        }
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


    $scope.selectCat = function (index) {
        $scope.pointSort=false;
        $scope.rateSort=false;
        for(var i=0;i<$scope.selected.length;i++){
            $scope.selected[i]=true;
        }
        $scope.selected[index] = false;
    };

    $scope.sort = function (type) {
        $scope.pointSort=false;
        switch (type){
            case 1:
                $scope.rateSort=false;
                for(var i=0;i<$scope.selected.length;i++){
                    $scope.selected[i]=false;
                }
                break;
            case 2:
                $scope.rateSort=true;
                break;
            default: break;
        }
    };

    $scope.select = function (point) {
        $scope.selectedPoint = point;
        if($scope.favPointIds.includes($scope.selectedPoint.PointId)) $scope.color="red";
        else $scope.color="grey";
        $scope.Map($scope.selectedPoint.Coordinates, $scope.selectedPoint.Description);
        $scope.selectedPoint.ViewNum += 1;
        $http.post('Points/viewsInc/' + $scope.selectedPoint.PointId);
        $http.get(`Users/reviewPoint/${$scope.selectedPoint.PointId}`).then((res) => {
            $scope.commentText = "";
            $scope.reviews = res.data.response;
        });
    };

    $scope.change = function () {
        if (!$scope.connected) alert("You need to log in, in order to use this functionality!");
        else {
            if (!$scope.favPointIds.includes($scope.selectedPoint.PointId)) {

                var url = `Users/log/insertFavourite/${$scope.username}/point/${$scope.selectedPoint.PointId}`;
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
            $scope.favPoints = response.data.response.map(favp => $scope.points.find(p => p.PointId == favp.PointId));
            $scope.favPointIds = $scope.favPoints.map(favp => favp.PointId);
            $scope.FavCounter = $scope.favPointIds.length;


        }).catch((res) => {
            alert("ERROR loading user favorites "+res);
        });
    };

    $scope.SaveChanges = function(){
        if($scope.rate){

            var payload = {
                Username : $scope.userName,
                Rate : $scope.rate
            };
            $http.post(`Users/ratePoint/${$scope.selectedPoint.PointId}`,JSON.stringify(payload)).then(()=>{
                $http.post(`Points/rate/${$scope.selectedPoint.PointId}`).then((res)=>{
                    $scope.selectedPoint.RateInPrec=res.data.per || 0;
                })
                alert("thank you for rating, changes saved");
            });
        }
    };

    $scope.GoToFavList = function(){
        $window.location.href = '/#!/favorite';
    }

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
    };

    $http.get('Points/getPoints').then(function (response) {
        $scope.points = response.data.response;
        $http.get('Points/categories').then(res => {
            $scope.categories = res.data.response;
            $scope.categories.forEach(c=>{
                $http.get(`Points/category/${c.CatId}`).then(res => {
                    var data=res.data.response;
                    $scope.view_points.push(data);
                });
            });
            if($scope.connected){
                $scope.setFavPoints();
            }
        });
    });
});