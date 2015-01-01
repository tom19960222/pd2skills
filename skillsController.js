app.controller('skillsController', [
	'$scope',

function($scope) {

	// ================================================================
	// = Onload
	// ================================================================

	$scope.set('display', {});


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
		$scope.hashStorage.setTreeData(tree);
		$scope.hashStorage.updateUrl();
	}
	
	$scope.resetAll = function() {

		$scope.skillsCalculator.trees.forEach(function(tree) {
			tree.unset();
			$scope.hashStorage.setTreeData(tree);
		});
		
		$scope.hashStorage.updateUrl();
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
		
		$scope.hashStorage.setTreeData(tree);
		$scope.hashStorage.updateUrl();
	}
	
	$scope.skillRemove = function(skill, tier, tree) {
		skill.unset();
		
		$scope.hashStorage.setTreeData(tree);
		$scope.hashStorage.updateUrl();
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