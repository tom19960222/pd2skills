app.controller(
	'skillsController',
	[
		'$scope',
		'HashStorage',

function($scope, HashStorage) {
	// ================================================================
	// = 計算點數相關技能相關
	// ================================================================
	$scope.updateTreeStatus = function(tree) {
		return tree.used;
	}
	
	$scope.getUsed = function() {
		return $scope.skillsCalculator.getAvailablePoint();
	}

	$scope.resetTree = function(tree) {
		tree.unset();
		HashStorage.setTreeData(tree);
		HashStorage.updateUrl();
	}
	
	$scope.resetAll = function(trees) {

		trees.forEach(function(tree) {
			tree.unset();
			HashStorage.setTreeData(tree);
		});
		
		HashStorage.updateUrl();
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
		
		HashStorage.setTreeData(tree);
		HashStorage.updateUrl();
	}
	
	$scope.skillRemove = function(skill, tier, tree) {
		skill.unset();
		
		HashStorage.setTreeData(tree);
		HashStorage.updateUrl();
	}
	
	$scope.skillUpdate = function(skill, tier, tree) {
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