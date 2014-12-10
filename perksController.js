app.controller('perksController', [
	'$scope',
	'$http',
	'HashStorage',

function($scope, $http, HashStorage) {

	// ================================================================
	// = 命名空間
	// ================================================================

	$scope.perkDecksCalculator = new PerkDecksCalculator();


	// ================================================================
	// = 載入設定檔
	// ================================================================
	
	var file = 'perks/config.json';
	$http.get(file).success(function(config) {

		var files	= config.files;
		
		// 複製陣列
		var temp	= files.slice(0);
		var counter	= files.length;
		
		files.forEach(function(file, index) {
			$http.get(file).success(function(data) {
				temp[index] = data;
				
				counter--;
				if (counter == 0) init(temp, config);
			});
		});

		function init (perks, config) {
			
			setupPerksConfig(perks, config);
			var perkDecksCalculator = new PerkDecksCalculator(perks);
			HashStorage.setupPerkDeckCalculator(perkDecksCalculator);

			$scope.perkDecksCalculator = perkDecksCalculator;

			console.log($scope.perkDecksCalculator);
		}

		function setupPerksConfig (perks, config) {
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

	}); // end $http end

}]);