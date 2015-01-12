app.controller('perksController', [
	'$scope',

function($scope) {

	// ================================================================
	// = Onload
	// ================================================================

	$scope.set('display', {});

	
	// ================================================================
	// = Events
	// ================================================================

	$scope.deckClick = function(deck) {
		deck.choice();
		$scope.perkDecksCalculator.save($scope.hashStorage);
	}

	$scope.deckHover = function(deck) {
		setDisplayDeck(deck);
	}

	// ================================================================
	// = 顯示相關
	// ================================================================
	
	// 設定顯示
	function setDisplayDeck(deck) {
		$scope.display.deck = deck;
	}

}]);