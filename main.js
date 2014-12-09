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
		templateUrl : 'template/skills-aside.html'
	};	
});

app.directive("skills", function() {
	return {
		restrict : 'C',
		templateUrl : 'template/skills.html',
		controller  : 'skillsController',
	};	
});

app.directive("perks", function() {
	return {
		restrict : 'C',
		templateUrl : 'template/perks.html',
		controller  : 'perksController',
	};	
});

app.directive("infamys", function() {
	return {
		restrict : 'C',
		templateUrl : 'template/infamy.html',
		controller  : 'infamyController',
	};	
});
