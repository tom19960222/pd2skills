app.controller('MainCtrl', function($scope, $http) {
	
	$scope.skillTree = [];
	
	// ================================================================
	// = 載入技能樹
	// ================================================================
	var treeInfo = null;
	$http.get('skillconfig.json').success(function loadSkillTree(data) {
		
		treeInfo = data;
		var trees = data.files.slice(0);
		var files = data.files;
		var fileCount = files.length;
		
		files.forEach(function(file, index) {
			$http.get(file).success(function(data) {
				trees[index] = data;
				fileCount -= 1;
				
				if (fileCount == 0)	afterLoad();
			});
			
		});
		
		function afterLoad() {
			setTreeTierInfo(trees, treeInfo);
			trees = initSkillTree(trees);
			
			loadSkillPointers(trees);
			
			$scope.skillTree = trees;
		}
    });
	
	// 設定階層訊息
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
	
	// 初始技能樹
	function initSkillTree(trees) {
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
		
		return trees;
	}
	
	
	// ================================================================
	// = 技能指標相關
	// ================================================================
	
	// 初始
	var skillPointers = {};
	
	// 技能設定指標
	function setSkillPointer(skill) {
		if (typeof skill.require !== "string") return skill.require = false;
		
		var pointerName = skill.require;
		if (typeof skillPointers[pointerName] === "undefined") {
			skillPointers[pointerName] = {"skill" : {}};
		}
		
		return skill.require = skillPointers[pointerName];
	}
	
	// 載入技能指標
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
	// = 顯示相關
	// ================================================================
	
	// 初始
	$scope.displaySkill = false;
	
	// 設定顯示
	function setDisplaySkill(skill, tier) {
		if ($scope.displaySkill === false) {
			var obj = {
				"skill" : skill,
				"tier"  : tier
			};
			
			$scope.displaySkill = obj;
		} else {
			$scope.displaySkill.skill = skill;
			$scope.displaySkill.tier  = tier;
		}
	}
	
	// 清除顯示
	function clearDisplaySkill() {
		$scope.displaySkill = false;
	}
	
	// 初始
	$scope.displayTree = false;
	
	// 設定顯示
	function setDisplayTree(tree) {
		if ($scope.displayTree === false) {
			var obj = {
				"tree" : tree
			};
			
			$scope.displayTree = obj;
		} else {
			$scope.displayTree.skill = skill;
			$scope.displayTree.tier  = tier;
		}
	}
	
	// 清除顯示
	function clearDisplaySkill() {
		$scope.displayTree = false;
	}
	
	
	
	// ================================================================
	// = 技能相關事件
	// ================================================================
	
	$scope.skillHover = function(skill, tier) {
		
		skill.hover = true;
		if (skill.unlockRequire === false) skill.require.skill.alert = true;
		
		setDisplaySkill(skill, tier);
	};
	
	$scope.skillLeave = function(skill, tier) {
		
		skill.hover = false;
		if (skill.unlockRequire === false) skill.require.skill.alert = false;
		
	}
	
	$scope.skillClick = function(skill, tier) {
		unlockSkill(skill);
	}
	
	$scope.skillRemove = function(skill, tier) {
		unsetSkill(skill);
	}
	
	$scope.skillUpdate = function(skill, tier, tree) {
		
		updateSkillUnlockStatus(skill, tier);
		updateSkillOwnStatus(skill)
		
		return getSkillStatusText(skill, tier);
	}
	
	$scope.skillStyle = function(skillIndex, tierIndex, treeIndex) {
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
	
	
	// ================================================================
	// = 技能狀態更新
	// ================================================================
	
	// 更新技能狀態
	function updateSkillUnlockStatus(skill, tier) {
		var leftPoint = $scope.totalPoint - $scope.usedPoint;
		
		// 判斷前置技能是否解鎖
		if (skill.require !== false) {
			skill.unlockRequire = (skill.require.skill.ownBasic === true)
		} else {
			skill.unlockRequire = true;
		}
		
		// 判斷階層是否解鎖
		if (tier.unlockStatus === true && skill.unlockRequire === true) {
			skill.unlockBasic = (leftPoint >= tier.skillUnlockPointBasic);
			skill.unlockAce   = (tier.skillUnlockPointAce > 0)
				? (skill.ownBasic)
					? (leftPoint >= tier.skillUnlockPointAce)
					: (leftPoint >= tier.skillUnlockPointBasic + tier.skillUnlockPointAce)
				: false;
		} else {
			skill.unlockBasic = false;
			skill.unlockAce   = false;
		}
		
	}
	
	function updateSkillOwnStatus(skill) {
		if (skill.unlockBasic !== true) skill.ownBasic = false;
		if (skill.unlockAce   !== true) skill.ownAce   = false;
	}
	
	// 取得技能狀態文字
	function getSkillStatusText(skill, tier) {
		
		if (skill.hover === true) {
			// 若階級未解鎖
			if (tier.unlockStatus !== true) return "locked";
			
			// 若未擁有基本
			if (skill.ownBasic !== true) return "basic-hover";
			
			// 若未擁有王牌
			if (skill.ownAce !== true) {
				if (tier.skillUnlockPointAce > 0)
					return "ace-hover";
			}
		}
		
		if (skill.ownAce === true) return "ace";
		if (skill.ownBasic === true) return "basic";
		
		return "none";
	}
	
	// 解鎖技能
	function unlockSkill(skill) {
		
		if (skill.ownBasic !== true) {
			
			if (skill.unlockBasic) skill.ownBasic = true;
			
		} else if (skill.ownAce !== true) {
			
			if (skill.unlockAce) skill.ownAce = true;
			
		}
		
	}
	
	// 重設技能
	function unsetSkill(skill) {
		skill.ownBasic = false;
		skill.ownAce   = false;
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
					if (skill.ownBasic === true) usedPoint += tier.skillUnlockPointBasic;
					if (skill.ownAce === true) usedPoint += tier.skillUnlockPointAce;
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