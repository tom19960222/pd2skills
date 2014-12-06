app.controller('infamyController', function($scope) {
	
	// ================================================================
	// = Event
	// ================================================================

	$scope.infamyClick = function(tree) {
		if (tree.infamy !== true) tree.infamy = true;
	}

	$scope.infamyRemove = function (tree) {
		if (tree.infamy !== false) tree.infamy = false;
	}


	// ================================================================
	// = Icon
	// ================================================================

	$scope.infamyIconStyle = function(index) {
		return getInfamyIconStyle(index);
	}

	function getInfamyIconStyle(index) {
		var space = 128;
		
		var x = 0 - (index * space);
		return {'backgroundPositionX': x +'px'};
	}
	
});