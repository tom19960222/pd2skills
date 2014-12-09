app.controller('mainController', [
	'$scope',
	'$http',
	'HashStorage',
	'InfamyStorage',

function($scope, $http, HashStorage, InfamyStorage) {
	
	// ================================================================
	// = 載入技能樹設定檔
	// ================================================================
	$scope.skillsCalculator = new SkillsCalculator({});
	$scope.trees = [];

	$http.get('skills/config.json').success(function loadTrees(config) {
		
		// 複製陣列
		var trees = config.files.slice(0);
		var files = config.files;
		var counter = files.length;
		
		files.forEach(function(file, index) {
			$http.get(file).success(function(data) {
				trees[index] = data;
				
				counter--;
				if (counter == 0) init(trees, config);
			});
			
		});
		
		function init(trees, treesConfig) {
			// 載入資料
			initTierConfig(trees, treesConfig);

			// 建構計算機物件
			var skillsCalculator = new SkillsCalculator(trees);
			
			// 載入指標
			//loadSkillPointers(skillsCalculator.trees);

			// 載入惡名
			HashStorage.updateInfamy(InfamyStorage.infamyStatus);
			InfamyStorage.update(skillsCalculator);
			
			// 載入Hash技能資料
			skillsCalculator.trees.forEach(function(tree) {
				HashStorage.updateTreeData(tree);
			});
			
			// 刷新計算機
			skillsCalculator.updateStatus();

			$scope.skillsCalculator = skillsCalculator;
			$scope.trees = skillsCalculator.trees;
		}

		/**
		 * 設定階層訊息
		 */
		function initTierConfig(trees, treeinfo) {
			trees.forEach(function(tree) {
				tree.tiers.forEach(function(tier) {
					var info = treeinfo.tierinfo[tier.tier];
					for (var attr in info) {
						tier[attr] = info[attr];
					}
				});
			});
		}
    });
	
	
	// ================================================================
	// = 命名空間
	// ================================================================
	
	// 初始
	$scope.display = {};
	
}]);