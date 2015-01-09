app.controller('infamyController', [
	'$scope',
	'hashStorage',
	'infamyStorage',

function($scope, hashStorage, infamyStorage) {

	// ================================================================
	// = Onload
	// ================================================================

	//$scope.set('display', {});
	

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
	// = Event
	// ================================================================
	
	$scope.infamyHover = function(talent, tier) {
		setDisplayinfamy(talent, tier);
	}
	
	$scope.infamyLeave = function(talent) {
	}
	
	$scope.infamyClick = function(talent) {
		talent.set(true);
	}
	
	$scope.infamyRemove = function(talent) {
		talent.set(false);
	}


	// ================================================================
	// = Display
	// ================================================================
	
	// 設定顯示
	function setDisplayinfamy(talent) {
		$scope.display.talent = talent;
	}
	
	// 清除顯示
	function clearDisplayinfamy() {
		$scope.display.talent = false;
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