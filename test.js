
var app = angular.module('myApp', []);

app.filter('htmlSafe', ['$sce', function($sce) {
	return function(text) {
		return $sce.trustAsHtml(text);
	}
}]);

app.controller('MainCtrl', function($scope, $http) {
	
	$scope.skillTree = [];
	
	// ================================================================
	// = 載入技能樹
	// ================================================================
	var skillTree = null;
	$http.get('skills.json').success(function loadSkillTree(skills) {
		
		var tiers = skills.trees[0].tiers;
		tiers = tiers.map(function(tier) {
			
			tier.skills = tier.skills.map(function(skill) {
				return {
					"name"  : (typeof skill.name !== "undefined")? skill.name : "[undefined]",
					"title" : (typeof skill.title !== "undefined")? skill.title : "[undefined]",
					"basic" : (typeof skill.basic !== "undefined")? skill.basic : "[undefined]",
					"ace"   : (typeof skill.ace !== "undefined")? skill.ace : "[undefined]",
					"text"  : (typeof skill.text !== "undefined")? skill.text : "",
					"require" : (typeof skill.require !== "undefined")? skill.require : false
				};
			});
			
			return tier;
		});
		
		skillTree = tiers;
		initSkillTree();
    });
	
	
	// ================================================================
	// = 載入技能資訊
	// ================================================================
	var skillTreeInfo = null;
	$http.get('skills_init.json').success(function(init) {
		skillTreeInfo = init;
		initSkillTree();
	});
	
	
	// ================================================================
	// = 初始化技能樹
	// ================================================================
	function initSkillTree() {
		if (skillTree == null || skillTreeInfo == null) return false;
		
		var info = skillTreeInfo.normal;
		var tiers = skillTree;
		
		tiers = tiers.map(function(tier) {
			
			initTreeTier(tier);
			
			tier.skills = tier.skills.map(function(skill) {
				initTreeSkill(skill);
				return skill;
			});
			
			
			// 載入階級資訊設定
			for (var attr in info[tier.tier]) {
				tier[attr] = info[tier.tier][attr];
			}
			
			return tier;
		});
		
		loadSkillRequirePoint(tiers);
		$scope.skillTree = skillTree;
		
		console.log(skillTree);
	}
	
	function initTreeTier(tier) {
		tier.unlockStatus = false;
		tier.unlockRequire = 0;
	}
	
	function initTreeSkill(skill) {
		
		skill.ownBasic = false;
		skill.ownAce   = false;
		
		skill.unlockBasic = false;
		skill.unlockAce   = false;
		
		skill.hover = false;
		skill.alert = false;
		
		if (skill.require) {
			initSkillRequirePoint(skill);
		}
	}
	
	var skillRequirePool = {};
	function initSkillRequirePoint(skill) {
		skillRequirePool[skill.require] = {"skill" : {}};
		skill.require = skillRequirePool[skill.require];
	}
	
	function loadSkillRequirePoint(tiers) {
		
		var skillNames = []
		for (var skillName in skillRequirePool) {
			skillNames.push(skillName);
		}
		
		tiers.map(function(tier) {
			tier.skills.map(function(skill) {
				if (skillNames.indexOf(skill.name) >= 0) {
					skillRequirePool[skill.name].skill = skill;
				}
			});
		});
		
		
	}
	
	
	// ================================================================
	// = 技能 Hover
	// ================================================================
	$scope.display = {};
	$scope.skillHover = function(skill, tier) {
		
		updateSkillUnlockStatus(skill, tier);
		
		skill.hover = true;
		if (skill.unlockRequire === false) skill.require.skill.alert = true;
		
		$scope.display.skill = skill;
		$scope.display.tier  = tier;
	};
	
	$scope.skillLeave = function(skill, tier) {
		
		skill.hover = false;
		if (skill.unlockRequire === false) skill.require.skill.alert = false;
		
	}
	
	function updateSkillUnlockStatus(skill, tier) {
		var leftPoint = $scope.totalPoint - $scope.usedPoint;
		
		if (skill.require !== false) {
			skill.unlockRequire = (skill.require.skill.ownBasic === true)
		} else {
			skill.unlockRequire = true;
		}
		
		if (tier.unlockStatus === true && skill.unlockRequire === true) {
			skill.unlockBasic = (leftPoint >= tier.skillUnlockPoint.basic);
			skill.unlockAce = (skill.ownBasic)
					? (leftPoint >= tier.skillUnlockPoint.ace)
					: (leftPoint >= tier.skillUnlockPoint.basic + tier.skillUnlockPoint.ace)
		} else {
			skill.unlockBasic = false;
			skill.unlockAce   = false;
		}
	}
	
	
	// ================================================================
	// = 技能狀態更新
	// ================================================================
	$scope.skillUpdate = function(skill, tier, tree) {
		if (tier.unlockStatus !== true) {
			// 移除技能
			unsetSkill(skill);
		}
		
		return (function(skill, tier) {
			
			if (skill.hover === true) {
				if (tier.unlockStatus !== true) return "locked";
				else if (skill.ownBasic !== true) return "basic-hover";
				else if (skill.ownAce !== true)
					if (typeof tier.skillUnlockPoint.ace !== "undefined")
						return "ace-hover";
			}
			
			if (skill.ownAce === true) return "ace";
			else if (skill.ownBasic === true) return "basic";
			else return "none"
		})(skill, tier);
	}
	
	
	// ================================================================
	// = 技能點擊事件
	// ================================================================
	$scope.skillClick = function(skill, tier) {
		
		if (skill.ownBasic !== true) {
			
			if (skill.unlockBasic) skill.ownBasic = true;
			
		} else if (skill.ownAce !== true) {
			
			if (skill.unlockAce) skill.ownAce = true;
			
		}
		
	}
	
	
	// ================================================================
	// = 技能取消事件
	// ================================================================
	$scope.skillRemove = function(skill, tier) {
		unsetSkill(skill);
	}
	
	function unsetSkill(skill) {
		skill.ownBasic = false;
		skill.ownAce = false;
	}
	
	
	// ================================================================
	// = 計算技能點
	// ================================================================
	$scope.totalPoint = 120;
	$scope.usedPoint = 0;
	
	$scope.updateTreeStatus = function(tree) {
		if (typeof tree === "undefined") return false;
		
		var usedPoint = 0;
		var tiers = tree;
		
		
		for (var i = 0; i < tiers.length; i++) {
			var tier = tiers[i];
			
			tier.unlockRequire = tier.tierUnlockPoint - usedPoint;
			tier.unlockStatus = (tier.unlockRequire <= 0);
			
			if (tier.unlockStatus === true) {
				// 計算該階層消耗技能點
				tier.skills.map(function(skill) {
					if (skill.ownBasic === true) usedPoint += tier.skillUnlockPoint.basic;
					if (skill.ownAce === true) usedPoint += tier.skillUnlockPoint.ace;
				});
			}
			
		}
		
		$scope.usedPoint = usedPoint;
	}
	
	$scope.getUsed = function() {
		return $scope.usedPoint
	}
	
	
});