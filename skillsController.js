app.controller('skillsController', [
	'$scope',

function($scope) {

	var backgroundImagePath = "./skills/";

	// ================================================================
	// = Onload
	// ================================================================

	$scope.set('display', {});


	// ================================================================
	// = 計算點數相關技能相關
	// ================================================================

	$scope.updateTreeStatus = function(tree) {
		return tree.getSpendPoint();
	}
	
	$scope.getAvailable = function() {
		return $scope.skillsCalculator.getAvailablePoint();
	}

	$scope.resetTree = function(tree) {
		tree.unset();
		tree.save($scope.hashStorage);
	}
	
	$scope.resetAll = function() {
		$scope.skillsCalculator.unset();
		$scope.skillsCalculator.save($scope.hashStorage);
	}

	// ================================================================
	// = getPlayerLevel
	// ================================================================

	function getRank(infamyUsedPoint) {
		return ['I', 'II', 'III', 'IV', 'V'][infamyUsedPoint - 1];
	}

	function getLevel(sp) {
		var b	= Math.floor(sp / 12);
		var d	= Math.min((sp - b * 12), 10);

		return (b * 10 + d);
	}

	$scope.getLevel = function () {
		var rank = getRank($scope.infamyCalculator.usedPoint);
		rank = (rank)? rank + '-' : '';

		var level = getLevel($scope.skillsCalculator.getSpendPoint());

		return rank + level;		
	}


	// ================================================================
	// = getCost
	// ================================================================

	$scope.getCost = function () {
		return $scope.skillsCalculator.getSpendCost();		
	}
	

	// ================================================================
	// = 技能相關事件
	// ================================================================
	
	$scope.skillHover = function(skill, tier) {
		if (skill.unlockRequire === false) skill.require.getTarget().alert = true;
		
		setDisplaySkill(skill, tier);
	}
	
	$scope.skillLeave = function(skill, tier) {
		
		if (skill.unlockRequire === false) skill.require.getTarget().alert = false;
		
	}
	
	$scope.skillClick = function(skill, tier, tree) {
		skill.unlock();
		tree.save($scope.hashStorage);
	}
	
	$scope.skillRemove = function(skill, tier, tree) {
		skill.unset();
		tree.save($scope.hashStorage);
	}
	
	$scope.skillUpdate = function(skill, tier, tree) {
	}


	// ================================================================
	// = Icon
	// ================================================================
	
	$scope.getIconStyle = function(e) {
		var name = e.name.toLowerCase();
		var url = "./skills/" + name + '.png';
		
		return {'backgroundImage': 'url(' + url + ')'};
	}

	$scope.getClassName = function(row, col) {
		return "skill_" + Number(row) + "-" + Number(col);
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
		
		for (var i = 1; i < tree.childList.length; i++) {
			var tier = tree.getChild(i);
			
			if ( ! tier.isUnlocked()) {
				if (i == 1) return 0;
				var base = tree.getChild(i - 1).unlockRequire;
				
				var range = tier.unlockRequire - base;
				var tierUsed = tree.getSpendPoint() - base;
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