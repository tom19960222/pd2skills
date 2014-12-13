app.controller('perksController', [
	'$scope',
	'$http',
	'HashStorage',

function($scope, $http, HashStorage) {

	// ================================================================
	// = Onload
	// ================================================================

	if ( ! ($scope.perkDecksCalculator instanceof PerkDecksCalculator)) {
		$scope.perkDecksCalculator = new PerkDecksCalculator;
		init();
	}


	// ================================================================
	// = Init
	// ================================================================

	function init() {
		
		loadFiles('perks/config.json');

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
			HashStorage.setupPerkDeckCalculator(newInstance);

			$scope.perkDecksCalculator = newInstance;
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
	}

}]);