app.controller('skillTreeController', function($scope, $http, $location) {
	
	// ================================================================
	// = 載入技能樹設定檔
	// ================================================================
	$scope.skillTrees = [];
	var skillTrees = [];
	var skillTreesConfig = null;
	
	$http.get('skillconfig.json').success(function loadSkillTrees(data) {
		
		skillTreesConfig = data;
		
		// 複製陣列
		var trees = data.files.slice(0);
		var files = data.files;
		var counter = files.length;
		
		files.forEach(function(file, index) {
			$http.get(file).success(function(data) {
				trees[index] = data;
				
				counter--;
				if (counter == 0) setSkillTrees(trees, skillTreesConfig);
			});
			
		});
		
		function setSkillTrees(trees, skillTreesConfig) {
			setTreeTierInfo(trees, skillTreesConfig);
			trees = initSkillTree(trees);
			
			loadSkillPointers(trees);
			
			var hash = $location.path().replace('/skill/', '');
			loadUrlHash(trees, hash);
			
			$scope.skillTrees = skillTrees = trees;
		}
    });
	
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
	
	/**
	 * 初始化技能樹
	 */
	function initSkillTree(trees) {
		trees = trees.map(function(tree) {
			tree = initTree(tree);
			
			tree.tiers = tree.tiers.map(function(tier) {
				tier = initTier(tier);
				
				tier.skills = tier.skills.map(function(skill) {
					skill = initSkill(skill);
					setSkillPointer(skill);
					
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
	// = 技能狀態更新相關
	// ================================================================
	
	/**
	 * 更新技能解鎖狀態
	 */
	function updateSkillUnlockStatus(skill, tier) {
		// 剩餘技能點
		var leftPoint = $scope.totalPoint - $scope.usedPoint;
		
		// 判斷前置技能是否解鎖
		if (skill.require !== false) {
			skill.unlockRequire = (skill.require.skill.ownBasic === true)
		} else {
			skill.unlockRequire = true;
		}
		
		// 判斷階層是否解鎖
		if (tier.unlockStatus === true && skill.unlockRequire === true) {
			skill.unlockBasic = (leftPoint >= tier.skillUnlockPointBasic || skill.ownBasic);
			skill.unlockAce   = (tier.skillUnlockPointAce > 0)
				? (skill.ownBasic)
					? (leftPoint >= tier.skillUnlockPointAce || skill.ownAce)
					: (leftPoint >= tier.skillUnlockPointBasic + tier.skillUnlockPointAce)
				: false;
		} else {
			skill.unlockBasic = false;
			skill.unlockAce   = false;
		}
	}
	
	/**
	 * 更新技能擁有狀態
	 */
	function updateSkillOwnStatus(skill) {
		if (skill.unlockBasic !== true) skill.ownBasic = false;
		if (skill.unlockAce   !== true) skill.ownAce   = false;
	}
	
	/**
	 * 更新技能狀態
	 */
	function updateSkillStatus(skill, tier) {
		updateSkillUnlockStatus(skill, tier);
		updateSkillOwnStatus(skill);
	}
	
	/**
	 * 取得技能狀態文字
	 */
	function getSkillStatusText(skill, tier) {
		
		if (skill.hover === true) {
			// 若階級未解鎖
			if (tier.unlockStatus !== true) return "locked";
			
			// 若未擁有基本
			if (skill.ownBasic !== true && skill.unlockBasic == true) return "basic-hover";
			
			// 若未擁有王牌
			if (skill.ownAce !== true && skill.unlockAce == true) return "ace-hover";
		}
		
		if (skill.ownAce === true) return "ace";
		if (skill.ownBasic === true) return "basic";
		
		return "none";
	}
	
	/**
	 * 解鎖技能
	 */
	function unlockSkill(skill) {
		
		if (skill.ownBasic !== true) {
			
			if (skill.unlockBasic) skill.ownBasic = true;
			
		} else if (skill.ownAce !== true) {
			
			if (skill.unlockAce) skill.ownAce = true;
			
		}
		
	}
	
	/**
	 * 重設技能
	 */
	function unsetSkill(skill) {
		skill.ownBasic = false;
		skill.ownAce   = false;
	}
	
	
	// ================================================================
	// = 計算技能點
	// ================================================================
	
	/**
	 * 更新技能樹消耗技能點
	 */
	function updateTreeUsedPoint(tree) {
		
		var usedPoint = 0;
		
		// 迴圈技能樹階層
		tree.tiers.forEach(function(tier) {
			
			// 更新解鎖狀態
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
	
	/**
	 * 計算所有技能樹消耗總技能點
	 */
	function getTotalUsedPoint(trees) {
		var usedPoint = 0;
		
		trees.forEach(function(tree) {
			usedPoint += tree.used;
		});
		
		return usedPoint;
	}
	
	/**
	 * 重設技能樹
	 */
	function unsetTree(tree) {
		unsetSkill(tree.tiers[0].skills[0]);
		updateTreeUsedPoint(tree);
	}
	
	/**
	 * 重設所有技能樹
	 */
	function unsetAllTrees(trees) {
		trees.forEach(function(tree) {
			unsetTree(tree);
		});
	}
	
	// ================================================================
	// = 其他函式
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
	
	$scope.skillClick = function(skill, tier, tree) {
		unlockSkill(skill);
		
		var hash = toUrlHash(skillTrees);
		$location.path("skill/" + hash);
	}
	
	$scope.skillRemove = function(skill, tier, tree) {
		unsetSkill(skill);
	}
	
	$scope.skillUpdate = function(skill, tier, tree) {
		updateSkillStatus(skill, tier)
		
		return getSkillStatusText(skill, tier);
	}
	
	$scope.skillStyle = function(skillIndex, tierIndex, treeIndex) {
		return getSkillIconStyle(skillIndex, tierIndex, treeIndex);
	}
	
	
	// ================================================================
	// = 顯示相關
	// ================================================================
	
	// 初始
	$scope.display = {};
	
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
	// = 顯示技能相關
	// ================================================================
	$scope.totalPoint = 120;
	$scope.usedPoint = 0;
	
	$scope.updateTreeStatus = function(tree) {
		updateTreeUsedPoint(tree);
		return tree.used;
	}
	
	$scope.getUsed = function() {
		
		
		$scope.usedPoint = getTotalUsedPoint($scope.skillTrees);
		return $scope.totalPoint - $scope.usedPoint;
	}
	
	$scope.resetTree = function(tree) {
		console.log("resetTree:" + tree);
		unsetTree(tree);
	}
	
	$scope.resetAll = function() {
		unsetAllTrees($scope.skillTrees);
	}
	
	
	// ================================================================
	// = Url
	// ================================================================
	
	function toUrlHash(trees) {
		
		var data = [];
		
		// 迴圈分析技能樹
		trees.forEach(function(tree) {
			
			// 宣告計數器
			var counter = 0;
			var treeData = "";
			
			tree.tiers.forEach(function(tier) {
				
				tier.skills.forEach(function(skill) {
					
					if (skill.ownBasic) {
						var code = counter + 97;
						if (skill.ownAce) code -= 32;
						
						treeData += String.fromCharCode(code);
					}
					
					// 計數器加一
					counter++;
				});
				
			}); // end forEach tiers
			
			if (treeData != "") {
				// 取技能樹的標頭
				var header = tree.name.charAt(0).toLowerCase();
				
				treeData = header + treeData;
				data.push(treeData);
			}
			
		}); // end forEach trees
		
		return data.join(':');
	}
	
	function loadUrlHash(trees, text) {
		
		var data = {};
		
		// 分割字串
		var parts = text.split(':');
		
		// 分析字串
		parts.forEach(function(part) {
			
			// 分割字元
			skillData = part.split('');
			// 取標頭
			var header = skillData.shift();
			
			// 字元轉Ascii碼
			skillData = skillData.map(function(code) {
				return code.charCodeAt(0);
			});
			
			// 新增至資料物件
			data[header] = skillData;
		});
		
		
		// 迴圈設定技能樹
		trees.forEach(function(tree) {
			
			var counter = 0;
			var header = tree.name.charAt(0).toLowerCase();
			
			if (typeof data[header] === "undefined") return;
			
			var treeData = data[header];
			
			tree.tiers.forEach(function(tier) {
				
				tier.skills.forEach(function(skill) {
					
					var skillAceCode = counter + 65;
					
					if (treeData.indexOf(skillAceCode) >= 0) {
						// 擁有 Ace
						skill.ownAce   = true;
						skill.ownBasic = true;
					} else if (treeData.indexOf(skillAceCode + 32) >= 0) {
						// 擁有 Basic
						skill.ownBasic = true;
					}
					
					// 計數器加一
					counter++;
				});
				
			}); // end forEach tiers
			
		}); // end forEach trees
		
	}
	
	
	// ================================================================
	// = Progress Bar
	// ================================================================
	
	function getProgressPercent(tree) {
		
		for (var i = 1; i < tree.tiers.length; i++) {
			var tier = tree.tiers[i];
			
			if (tier.unlockStatus == false) {
				if (i == 1) return 0;
				var basic = tree.tiers[i - 1].tierUnlockPoint;
				
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
});

