app.controller('infamyController', [
	'$scope',
	'hashStorage',
	'infamyStorage',

function($scope, hashStorage, infamyStorage) {

	// ================================================================
	// = Onload
	// ================================================================

	$scope.set('display', {});
	$scope.infamys = infamyStorage.infamyStatus;
	

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
		infamyStorage.update($scope.skillsCalculator);
		hashStorage.setInfamy(infamyStorage.infamyStatus);
		hashStorage.updateUrl();
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