app.controller(
	'mainController',
	[
		'$scope',
		'$http',
		'HashStorage',

function($scope, $http, HashStorage) {
	
	// ================================================================
	// = 載入技能樹設定檔
	// ================================================================
	$scope.skillsCalculator = new SkillsCalculator({});
	$scope.trees = [];

	$http.get('skillsconfig.json').success(function loadTrees(config) {
		
		// 複製陣列
		var trees = config.files.slice(0);
		var files = config.files;
		var counter = files.length;
		
		files.forEach(function(file, index) {
			$http.get(file).success(function(data) {
				trees[index] = data;
				
				counter--;
				if (counter == 0) after(trees, config);
			});
			
		});
		
		function after(trees, treesConfig) {
			// 載入資料
			setTreeTierInfo(trees, treesConfig);

			// 建構計算機物件
			var skillsCalculator = new SkillsCalculator(trees);
			
			// 載入指標
			loadSkillPointers(skillsCalculator.trees);
			
			// 載入Hash技能資料
			trees.forEach(function(tree) {
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
		function setTreeTierInfo(trees, treeinfo) {
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
	// = 技能指標相關
	// ================================================================
	
	// 初始化指標儲存物件
	var skillPointers = {};
	
	/**
	 * 設定技能指標
	 */
	function setSkillPointer(skill) {
		if (typeof skill.require !== "string") return skill.require = false;
		
		var pointerName = skill.require;
		if (typeof skillPointers[pointerName] === "undefined") {
			skillPointers[pointerName] = {"skill" : {}};
		}
		
		return skill.require = skillPointers[pointerName];
	}

	/**
	 * 讀取技能指標
	 */
	function loadSkillPointers(trees) {
		var skillNames = [];
		for (var skillName in skillPointers) skillNames.push(skillName);
		
		// 迴圈查找技能
		trees.forEach(function(tree) {
			tree.tiers.forEach(function(tier) {
				tier.skills.forEach(function(skill) {
					// 查找技能名稱
					if (skillNames.indexOf(skill.name) >= 0) {
						skillPointers[skill.name].skill = skill;
					}
				});
			});
		});
	}
	

	// ================================================================
	// = 顯示相關
	// ================================================================
	
	// 初始
	$scope.display = {};
	
	
	
	

}]);