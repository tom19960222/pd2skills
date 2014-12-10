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

app.directive("blockSkills", function() {
	return {
		restrict : 'C',
		templateUrl : 'template/skills.html',
		controller  : 'skillsController',
	};	
});

app.directive("blockPerks", function() {
	return {
		restrict : 'C',
		templateUrl : 'template/perks.html',
		controller  : 'perksController',
	};	
});

app.directive("blockInfamys", function() {
	return {
		restrict : 'C',
		templateUrl : 'template/infamy.html',
		controller  : 'infamyController',
	};	
});
