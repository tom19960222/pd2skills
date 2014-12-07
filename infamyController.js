app.controller('infamyController', [
	'$scope',
	'HashStorage',
	'InfamyStorage',

function($scope, HashStorage, InfamyStorage) {

	$scope.infamys = InfamyStorage.infamyStatus;

	// ================================================================
	// = Event
	// ================================================================

	$scope.infamyClick = function(infamy) {
		infamy.infamy = true;
		updateInfamyStatue();
	}

	$scope.infamyRemove = function (infamy) {
		infamy.infamy = false;
		updateInfamyStatue();
	}

	function updateInfamyStatue() {
		InfamyStorage.update($scope.skillsCalculator);
		HashStorage.setInfamy(InfamyStorage.infamyStatus);
		HashStorage.updateUrl();
	}


	// ================================================================
	// = Icon
	// ================================================================

	$scope.infamyIconStyle = function(index) {
		return getInfamyIconStyle(index);
	}

	function getInfamyIconStyle(index) {
		var space = 128;
		
		var x = 0 - (128 + index * space);
		return {'backgroundPositionX': x +'px'};
	}
	
}]);