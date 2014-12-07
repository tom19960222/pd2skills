/**
 * 計算機類別
 */
function SkillsCalculator(arg) {
	// 防止未經 new 建構類別
	if ( ! this instanceof SkillsCalculator) return new SkillsCalculator(arg);

	this.total	= 120;
	this.used	= 0;

	this.trees	= [];

	this.pointers = {};

	this.init(arg);
}

SkillsCalculator.fn = SkillsCalculator.prototype;

SkillsCalculator.fn.init = function(arg) {

	this.trees = this.initTrees(arg);
	this.initPointers();
};


SkillsCalculator.fn.initTrees = function(trees) {
	if ( ! (trees instanceof Array)) return [];
	
	var self = this;

	return trees.map(function(tree) {
		var treeObject = new Tree(self);
		treeObject.init(tree);

		return treeObject;
	});
}

/**
 * 呼叫更新
 */
SkillsCalculator.fn.callParentUpdate = function() {
	this.updateStatus();
}


SkillsCalculator.fn.updateStatus = function() {
	var self = this;
	var used = 0;

	// 更新階層狀態
	this.trees.forEach(function(tree) {
		used += tree.updateStatus();
	});
	
	this.used = used;

	// 更新技能狀態
	this.trees.forEach(function(tree) {
		tree.updateSkillStatus(self.getAvailablePoint());
	});

}

SkillsCalculator.fn.getUsedPoint = function() {
	return this.used;
}

SkillsCalculator.fn.getAvailablePoint = function() {
	return this.total - this.used;
}


/**
 * 設定技能指標
 */
SkillsCalculator.fn.initPointers = function() {
	var skillPointers = this.pointers;

	this.trees.forEach(function(tree) {
		tree.tiers.forEach(function(tier) {
			tier.skills.forEach(function(skill) {
				setSkillPointer(skill);
			});
		});
	});

	var skillNames = [];
	for (var skillName in this.pointers) skillNames.push(skillName);
	
	// 迴圈查找技能
	this.trees.forEach(function(tree) {
		tree.tiers.forEach(function(tier) {
			tier.skills.forEach(function(skill) {
				// 查找技能名稱
				if (skillNames.indexOf(skill.name) >= 0) {
					skillPointers[skill.name].skill = skill;
				}
			});
		});
	});

	function setSkillPointer(skill) {
		if (typeof skill.require !== "string") return skill.require = false;
		
		var pointerName = skill.require;
		if (typeof skillPointers[pointerName] === "undefined") {
			skillPointers[pointerName] = {"skill" : {}};
		}
		
		return skill.require = skillPointers[pointerName];
	}
}