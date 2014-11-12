
var app = angular.module('myApp', []);

app.controller('MainCtrl', function($scope, $http) {
	$scope.totalPoint = 4;
	$scope.used = 0;
	
	$scope.tree = [];
	$http.get('tree.json').success(function(data) {
		data = data.map(function(v, k) {
			return {
				"name" : v.name || "",
				"note" : v.note || "",
				"basic" : false
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
		if (e.basic !== true) {
			
			var leftPoint = $scope.getUsed();
			if ($scope.used <= 0) return;
		}
		
		e.used = !e.used;
	}
	
	$scope.getUsed = function() {
		var used = 0;
		
		angular.forEach($scope.tree, function(e) {
			if (e.used) {
				used += 1;
			}
		});
		
		return $scope.used = $scope.totalPoint - used;
	}
	
});