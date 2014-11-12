
var app = angular.module('myApp', []);

app.controller('MainCtrl', function($scope, $http) {
	$scope.totalPoint = 4;
	$scope.point = 0;
	
	$scope.tree = [];
	$http.get('tree.json').success(function(data) {
		data = data.map(function(v, k) {
			return {
				"name" : v.name || "未定義名稱",
				"note" : v.note || "未定義內容",
				"basic" : false,
				"ace" : false
			};
		});
		
        $scope.tree = data;
    });
	
	
	
	$scope.display = {
		name : "標題",
		note : "內容"
	};
	
	$scope.hover = function(e) {
		$scope.display.name = e.name;
		$scope.display.note = e.note;
	};
	
	$scope.click = function(e) {
		if (e.basic != true) {
			if ($scope.point > 0) return e.basic = true;
		} else if (e.ace != true) {
			if ($scope.point > 1) return e.ace = true;
		}
	}
	
	$scope.click2 = function(e) {
		e.basic = false;
		e.ace = false;
	}
	
	$scope.getUsed = function() {
		var point = 0;
		
		angular.forEach($scope.tree, function(e) {
			if (e.basic === true) point += 1;
			if (e.ace === true) point += 2;
		});
		
		return $scope.point = $scope.totalPoint - point;
	}
	
});