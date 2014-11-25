app.controller('MainCtrl', function($scope, $http) {
	
	$scope.skillTree = [];
	
	// ================================================================
	// = 載入技能樹
	// ================================================================
	var treeInfo = null;
	$http.get('skills.json').success(function loadSkillTree(data) {
		
		var trees = data.trees;
		trees = trees.map(function(tree) {
			tree = initTree(tree);
			
			tree.tiers = tree.tiers.map(function(tier) {
				tier = initTier(tier);
				
				tier.skills = tier.skills.map(function(skill) {
					skill = initSkill(skill);
					setSkillPointer(skill)
					
					return skill;
				});
				
				return tier;
			});
			
			return tree;
		});
		
		loadSkillPointers(trees);
		
		$http.get('skills_init.json').success(function(data) {
			treeInfo = data;
			
			trees.forEach(function(tree) {
				tree.tiers.forEach(function(tier, tierIndex) {
					var info = data.normal[tier.tier];
					for (var attr in info) {
						tier[attr] = info[attr];
					}
				});
			});
			
			$scope.skillTree = trees;
		});
		
    });
	
	
	// ================================================================
	// = 載入技能資訊
	// ================================================================
	
	var skillPointers = {};
	function setSkillPointer(skill) {
		if (typeof skill.require !== "string") return skill.require = false;
		
		var pointerName = skill.require;
		return skill.require = skillPointers[pointerName] = {"skill" : {}};
	}
	
	function loadSkillPointers(trees) {
		var skillNames = [];
		for (var skillName in skillPointers) skillNames.push(skillName);
		
		trees.forEach(function(tree) {
			tree.tiers.forEach(function(tier) {
				tier.skills.forEach(function(skill) {
					if (skillNames.indexOf(skill.name) >= 0) {
						skillPointers[skill.name].skill = skill;
					}
				});
			});
		});
		
	}
	
	
	
	
	// ================================================================
	// = 技能 Hover
	// ================================================================
	$scope.display = {};
	$scope.skillHover = function(skill, tier) {
		
		skill.hover = true;
		if (skill.unlockRequire === false) skill.require.skill.alert = true;
		
		$scope.display.skill = skill;
		$scope.display.tier  = tier;
	};
	
	$scope.skillLeave = function(skill, tier) {
		
		skill.hover = false;
		if (skill.unlockRequire === false) skill.require.skill.alert = false;
		
	}
	
	
	// ================================================================
	// = 技能狀態更新
	// ================================================================
	$scope.skillUpdate = function(skill, tier, tree) {
		
		if (tier.unlockStatus !== true) {
			// 移除技能
			unsetSkill(skill);
		}
		updateSkillUnlockStatus(skill, tier);
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
			else return "none";
		})(skill, tier);
	}
	
	function updateSkillUnlockStatus(skill, tier) {
		var leftPoint = $scope.totalPoint - $scope.usedPoint;
		
		if (skill.require !== false) {
			skill.unlockRequire = (skill.require.skill.ownBasic === true)
		} else {
			skill.unlockRequire = true;
		}
		
		// 判斷階層是否解鎖
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
		var tiers = tree.tiers;
		
		
		tree.tiers.forEach(function(tier) {
			
			tier.unlockRequire = tier.tierUnlockPoint - usedPoint;
			tier.unlockStatus = (tier.unlockRequire <= 0);
			
			if (tier.unlockStatus === true) {
				// 計算該階層消耗技能點
				tier.skills.forEach(function(skill) {
					if (skill.ownBasic === true) usedPoint += tier.skillUnlockPoint.basic;
					if (skill.ownAce === true) usedPoint += tier.skillUnlockPoint.ace;
				});
			}
			
		});
		
		return tree.used = usedPoint;
	}
	
	$scope.getUsed = function() {
		
		var usedPoint = 0;
		$scope.skillTree.forEach(function(tree) {
			usedPoint += tree.used;
		});
		
		$scope.usedPoint = usedPoint;
		return $scope.totalPoint - $scope.usedPoint;
	}
	
	// ================================================================
	var tab = "";
	$scope.clickTab = function(name) {
		tab = name;
		$scope.display = {};
	}
	
	$scope.isShowTree = function(name) {
		return (tab === name);
	}
	
});