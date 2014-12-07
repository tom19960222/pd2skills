var app = angular.module('myApp', []);


app.factory("HashStorage", ["$location", function($location) {
	return new SkillsHashStorage($location);
}]);

app.factory("InfamyStorage", [function() {
	return new SkillsInfamyStorage();
}]);



app.directive("skillAside", function() {
	return {
		restrict : 'A',
		templateUrl : 'skills-aside.html'
	};	
});

app.directive("skills", function() {
	return {
		restrict : 'C',
		templateUrl : 'skills.html',
		controller  : 'skillsController',
	};	
});

app.directive("infamys", function() {
	return {
		restrict : 'C',
		templateUrl : 'infamy.html',
		controller  : 'infamyController',
	};	
});

app.directive("perks", function() {
	return {
		restrict : 'C',
		templateUrl : 'perks.html',
		controller  : 'perksController',
	};	
});