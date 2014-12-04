var app = angular.module('myApp', [])

app.directive("skillTree", function() {
	return {
		restrict : 'E',
		templateUrl : 'skillTree.html',
		controller  : 'skillTreeController',
	};	
});

app.directive("infamy", function() {
	return {
		restrict : 'E',
		templateUrl : 'infamy.html',
		controller  : 'infamyController',
	};	
});