/**
 * 計算機類別
 */
function SkillsCalculator(arg) {
	// 防止未經 new 建構類別
	if ( ! this instanceof SkillsCalculator) return new SkillsCalculator(arg);

	this.total	= 120;
	this.used	= 0;

	this.trees	= [];
	
	this.init(arg);
}

SkillsCalculator.fn = SkillsCalculator.prototype;

SkillsCalculator.fn.init = function(arg) {

	this.trees = this.initTrees(arg);
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


SkillsCalculator.fn.updateStatus = function() {
	var self = this;
	this.used = 0;

	// 更新階層狀態
	this.trees.forEach(function(tree) {
		this.used += tree.updateStatus();
	});

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