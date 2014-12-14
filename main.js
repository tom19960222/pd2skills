var app = angular.module('myApp', []);


app.factory("hashStorage", ["$location", function($location) {
	return new HashStorage($location);
}]);

app.factory("infamyStorage", [function() {
	return new InfamyStorage();
}]);


// ================================================================
// = Main Block
// ================================================================

app.directive("mainSkills", function() {
	return {
		restrict	: 'C',
		templateUrl : 'template/skills.html',
		controller  : 'skillsController',
	};	
});

app.directive("mainPerks", function() {
	return {
		restrict : 'C',
		templateUrl : 'template/perks.html',
		controller  : 'perksController',
	};	
});

app.directive("mainInfamy", function() {
	return {
		restrict : 'C',
		templateUrl : 'template/infamy.html',
		controller  : 'infamyController',
	};	
});


// ================================================================
// = Aside Block
// ================================================================

app.directive("asideSkills", function() {
	return {
		restrict : 'C',
		templateUrl : 'template/skills-aside.html',
	};	
});

app.directive("asidePerks", function() {
	return {
		restrict : 'C',
		templateUrl : 'template/perks-aside.html',
	};
});

app.directive("asideInfamy", function() {
	return {
		restrict : 'C',
		templateUrl : 'template/infamy-aside.html',
	};	
});
