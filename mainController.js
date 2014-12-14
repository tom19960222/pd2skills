app.controller('mainController', [
	'$scope',

function($scope) {
	
	// ================================================================
	// = Space
	// ================================================================
	
	$scope.display = {};

	$scope.skillsCalculator = null;

	$scope.perkDecksCalculator = null;
	

	// ================================================================
	// = Method
	// ================================================================

	$scope.set = function(name, value) {
		return $scope[name] = value;
	}
	
}]);