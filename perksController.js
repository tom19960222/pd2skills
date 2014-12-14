app.controller('perksController', [
	'$scope',
	'$http',
	'hashStorage',

function($scope, $http, hashStorage) {

	// ================================================================
	// = Onload
	// ================================================================

	$scope.set('display', {});

	if ( ! ($scope.perkDecksCalculator instanceof PerkDecksCalculator)) {
		init('perks/config.json');
	}


	// ================================================================
	// = Init
	// ================================================================

	function init(file) {

		$scope.set('perkDecksCalculator', new PerkDecksCalculator);
		loadFiles(file);

		function loadFiles(file) {

			$http.get(file).success(function(config) {

				var files	= config.files;
				
				// 複製陣列
				var temp	= files.slice(0);
				var counter	= files.length;
				
				files.forEach(function(file, index) {
					$http.get(file).success(function(data) {
						temp[index] = data;
						
						counter--;
						if (counter == 0) afterLoad(temp, config);
					});
				});

			}); // end $http end

		}

		function afterLoad(perks, config) {
			
			setupPerksConfig(perks, config);
			var newInstance = new PerkDecksCalculator(perks);
			hashStorage.setupPerkDeckCalculator(newInstance);

			$scope.set('perkDecksCalculator', newInstance);
		}

		function setupPerksConfig(perks, config) {
			perks.forEach(function (perk) {
				perk.decks = [
					perk.decks[0],
					config.decksInfo[0],
					perk.decks[1],
					config.decksInfo[1],
					perk.decks[2],
					config.decksInfo[2],
					perk.decks[3],
					config.decksInfo[3],
					perk.decks[4]
				];
			});
		}
	}


	// ================================================================
	// = Events
	// ================================================================

	$scope.deckClick = function(deck) {
		deck.callSet();
		hashStorage.setPerkDeckCalculatorData($scope.perkDecksCalculator);
		hashStorage.updateUrl();
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