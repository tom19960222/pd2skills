var app = angular.module('myApp', []);


app.factory("HashStorage", ["$location", function($location) {
	return new SkillsHashStorage($location);
}]);

app.directive("skills", function() {
	return {
		restrict : 'C',
		templateUrl : 'skills.html',
		controller  : 'skillsController',
	};	
});

app.directive("skillAside", function() {
	return {
		restrict : 'A',
		templateUrl : 'skills-aside.html'
	};	
});

app.directive("infamy", function() {
	return {
		restrict : 'C',
		templateUrl : 'infamy.html',
		controller  : 'infamyController',
	};	
});