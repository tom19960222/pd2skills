app.controller('skillsController', [
	'$scope',
	'$http',
	'hashStorage',
	'infamyStorage',

function($scope, $http, hashStorage, infamyStorage) {

	// ================================================================
	// = Onload
	// ================================================================

	$scope.set('display', {});

	if ( ! ($scope.skillsCalculator instanceof SkillsCalculator)) {
		init('skills/config.json');
	}


	// ================================================================
	// = Init
	// ================================================================
	
	function init(file) {

		$scope.set('skillsCalculator', new SkillsCalculator);
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

			}); // end $http get
		
		}

		function afterLoad(trees, config) {
			// 初始階級設定資料
			initTierConfig(trees, config);

			// 建構計算機物件
			var newInstance = new SkillsCalculator(trees);
			
			// 載入惡名
			hashStorage.setupInfamy(infamyStorage.infamyStatus);
			infamyStorage.update(newInstance);
			
			// 載入Hash技能資料
			hashStorage.setupSkillsCalculator(newInstance);
			newInstance.updateStatus();

			// 存入命名空間
			$scope.set('skillsCalculator', newInstance);
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
	}


	// ================================================================
	// = 計算點數相關技能相關
	// ================================================================

	$scope.updateTreeStatus = function(tree) {
		return tree.used;
	}
	
	$scope.getAvailable = function() {
		return $scope.skillsCalculator.getAvailablePoint();
	}

	$scope.resetTree = function(tree) {
		tree.unset();
		hashStorage.setTreeData(tree);
		hashStorage.updateUrl();
	}
	
	$scope.resetAll = function() {

		$scope.skillsCalculator.trees.forEach(function(tree) {
			tree.unset();
			hashStorage.setTreeData(tree);
		});
		
		hashStorage.updateUrl();
	}

	// ================================================================
	// = getPlayerLevel
	// ================================================================

	function getLevel(sp) {
		var b	= Math.floor(sp / 12);
		var d	= Math.min((sp - b * 12), 10);

		return (b * 10 + d);
	}

	$scope.getLevel = function () {
		return getLevel($scope.skillsCalculator.used);		
	}
	
	// ================================================================
	// = 技能相關事件
	// ================================================================
	
	$scope.skillHover = function(skill, tier) {
		
		if (skill.unlockRequire === false) skill.require.skill.alert = true;
		
		setDisplaySkill(skill, tier);
	};
	
	$scope.skillLeave = function(skill, tier) {
		
		if (skill.unlockRequire === false) skill.require.skill.alert = false;
		
	}
	
	$scope.skillClick = function(skill, tier, tree) {
		skill.unlock();
		
		hashStorage.setTreeData(tree);
		hashStorage.updateUrl();
	}
	
	$scope.skillRemove = function(skill, tier, tree) {
		skill.unset();
		
		hashStorage.setTreeData(tree);
		hashStorage.updateUrl();
	}
	
	$scope.skillUpdate = function(skill, tier, tree) {
	}


	// ================================================================
	// = Icon
	// ================================================================
	
	/**
	 * 取得技能圖示樣式
	 */
	function getSkillIconStyle(skillIndex, tierIndex, treeIndex) {
		var x = 11;
		var y = 41;
		
		var skillMargin = 64 + 9;
		var tierMargin = 64 + 7;
		var treeMargin = skillMargin * 3 + 7;
		
		if (tierIndex == 6) {
			skillIndex += 1;
		}
		
		x = 0 - (x + treeMargin * treeIndex + skillMargin * skillIndex);
		y = 0 - (y + tierMargin * tierIndex);
		
		return {'backgroundPosition': x +"px "+ y +"px"};
	}
	
	$scope.skillStyle = function(skillIndex, tierIndex, treeIndex) {
		return getSkillIconStyle(skillIndex, tierIndex, treeIndex);
	}
	

	// ================================================================
	// = 顯示相關
	// ================================================================
	
	// 設定顯示
	function setDisplaySkill(skill, tier) {
		$scope.display.skill = skill;
		$scope.display.tier  = tier;
	}
	
	// 清除顯示
	function clearDisplaySkill() {
		$scope.display.skill = false;
		$scope.display.tier  = false;
	}
	
	
	
	// 設定顯示
	function setDisplayTree(tree) {
		$scope.display.tree = tree;
	}
	
	// 清除顯示
	function clearDisplaySkill() {
		$scope.display.tree = false;
	}
	
	
	// ================================================================
	// = Tabs
	// ================================================================
	
	$scope.clickTab = function() {
		clearDisplaySkill();
	}
	

	// ================================================================
	// = Progress Bar
	// ================================================================
	
	/**
	 * 取得進度條百分比
	 */
	function getProgressPercent(tree) {
		
		for (var i = 1; i < tree.tiers.length; i++) {
			var tier = tree.tiers[i];
			
			if (tier.unlockStatus == false) {
				if (i == 1) return 0;
				var basic = tree.tiers[i - 1].unlockPoint;
				
				var range = tier.tierUnlockPoint - basic;
				var tierUsed = tree.used - basic;
				var tierProgress = Math.floor(tierUsed / range * 100 * 0.2);
				var progress = (i - 2) * 20;
				
				return progress + tierProgress;
			}
		}
		
		return 100;
	}
	
	$scope.getProgressBarStyle = function(tree) {
		return {height : getProgressPercent(tree) + '%'};
	}


}]);