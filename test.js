
var app = angular.module('myApp', []);

app.filter('htmlSafe', ['$sce', function($sce) {
	return function(text) {
		return $sce.trustAsHtml(text);
	}
}]);

app.controller('MainCtrl', function($scope, $http) {
	$scope.totalPoint = 120;
	$scope.usedPoint = 0;
	
	$scope.tree = [];
	$scope.skillInit = null;
	$http.get('skills.json').success(function loadSkillTree(skills) {
		
		var tiers = skills.trees[0].tiers;
		tiers = tiers.map(function(tier) {
			
			tier.skills = tier.skills.map(function(skill) {
				return {
					"name"  : (typeof skill.name !== "undefined")? skill.name : "[undefined]",
					"title" : (typeof skill.title !== "undefined")? skill.title : "[undefined]",
					"basic" : (typeof skill.basic !== "undefined")? skill.basic : "[undefined]",
					"ace"   : (typeof skill.ace !== "undefined")? skill.ace : "[undefined]",
					"text"  : (typeof skill.text !== "undefined")? skill.text : "[undefined]",
					"own"   : {
						"basic"     : false,
						"ace"       : false
					}
				};
			});
			
			return tier;
		});
		
		$http.get('skills_init.json').success(function(init) {
			$scope.skillInit = init;
			
			var normal = init.normal;
			tiers = tiers.map(function(tier) {
				for (var attr in normal[tier.tier]) {
					tier[attr] = normal[tier.tier][attr];
				}
				return tier;
			});
		});
		
		
		$scope.tree = tiers;
    });
	
	
	
	
	
	$scope.display = {};
	$scope.skillHover = function(skill, tier) {
		$scope.display.skill = skill;
		$scope.display.tier = tier;
	};
	
	$scope.skillClick = function(skill, tier) {
		
		if (tier.isUnlocked !== true) return false;
		
		var leftPoint = $scope.totalPoint - $scope.usedPoint;
		
		if (skill.own.basic !== true) {
			
			if (tier.unlockPoint.basic <= leftPoint) skill.own.basic = true;
			
		} else if (skill.own.ace !== true) {
			
			if (tier.unlockPoint.ace <= leftPoint) skill.own.ace = true;
			
		}
		
	}
	
	$scope.skillCancel = function(skill, tier) {
		unsetSkill(skill);
	}
	
	$scope.getUsed = function() {
		var usedPoint = 0;
		
		angular.forEach($scope.tree, function(tier) {
			// 判斷是否解鎖
			tier.isUnlocked = (tier.tierUnlockPoint <= usedPoint);
			if (tier.isUnlocked === true) {
				// 計算消耗技能點
				tier.skills.map(function(skill) {
					if (skill.own.basic === true) usedPoint += tier.unlockPoint.basic;
					if (skill.own.ace === true) usedPoint += tier.unlockPoint.ace;
				});
			} else {
				// 移除技能
				tier.skills.map(function(skill) {
					unsetSkill(skill);
				});
			}
			
		});
		
		$scope.usedPoint = usedPoint;
		return $scope.totalPoint - $scope.usedPoint;
	}
	

	function unsetSkill(skill) {
		skill.own.basic = false;
		skill.own.ace   = false;
	}
});