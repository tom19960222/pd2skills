app.controller('infamyController', [
	'$scope',

function($scope) {

	// ================================================================
	// = Onload
	// ================================================================

	$scope.set('display', {});
	

	// ================================================================
	// = Event
	// ================================================================

	$scope.infamyClick = function(talent) {
		talent.set(true);
		$scope.infamyCalculator.save($scope.hashStorage);
	}

	$scope.infamyRemove = function (talent) {
		talent.set(false);
		$scope.infamyCalculator.save($scope.hashStorage);
	}
	

	// ================================================================
	// = Event
	// ================================================================
	
	$scope.infamyHover = function(talent, tier) {
		setDisplayinfamy(talent, tier);
	}
	
	$scope.infamyLeave = function(talent) {
	}


	// ================================================================
	// = Icon
	// ================================================================
	
	$scope.getIconStyle = function(e) {
		var name = "infamy";
		var url = "./infamy/" + name + '.png';
		
		return {'backgroundImage': 'url("' + url + '")'};
	}

	$scope.getClassName = function(row, col) {
		return "talent_" + Number(row) + "-" + Number(col);
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

}]);