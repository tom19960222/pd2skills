app.controller('mainController', [
	'$scope',
	'$http',
	'HashStorage',
	'InfamyStorage',

function($scope, $http, HashStorage, InfamyStorage) {
	
	// ================================================================
	// = 命名空間
	// ================================================================
	
	$scope.display = {};
	
	$scope.skillsCalculator = new SkillsCalculator({});
	$scope.trees = [];


	// ================================================================
	// = 載入設定檔
	// ================================================================

	var file = 'skills/config.json';
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
		
		function init(trees, config) {
			// 初始階級設定資料
			initTierConfig(trees, config);

			// 建構計算機物件
			var skillsCalculator = new SkillsCalculator(trees);
			
			// 載入惡名
			HashStorage.updateInfamy(InfamyStorage.infamyStatus);
			InfamyStorage.update(skillsCalculator);
			
			// 載入Hash技能資料
			HashStorage.setupSkillsCalculator(skillsCalculator);
			skillsCalculator.updateStatus();

			// 存入命名空間
			$scope.skillsCalculator = skillsCalculator;
			$scope.trees = skillsCalculator.trees;
		}

		/**
		 * 設定階層訊息
		 */
		function initTierConfig(trees, treeConfig) {
			trees.forEach(function(tree) {
				tree.tiers.forEach(function(tier) {
					var info = treeConfig.tierinfo[tier.tier];
					for (var attr in info) {
						tier[attr] = info[attr];
					}
				});
			});
		}

    }); // end $http get
	
}]);