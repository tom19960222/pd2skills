/**
 * 技能樹類別
 */
function Tree(parentTrees) {
	// 防止未經 new 建構類別
	if ( ! this instanceof Tree) return new Tree();

	this._parentTrees = parentTrees;

	this.name	= "";
	this.title	= "";
	this.text	= "";

	this.tiers	= [];
	this.used	= 0;
	this.infamy = false;
}

Tree.fn = Tree.prototype;

Tree.fn.init = function(arg) {
	this.name	= (typeof arg.name	!== "undefined")? arg.name	: "[undefined]";
	this.title	= (typeof arg.title	!== "undefined")? arg.title	: "[undefined]";
	this.text	= (typeof arg.text	!== "undefined")? arg.text	: "[undefined]";

	this.tiers	= (typeof arg.tiers !== "undefined")? this.initTiers(arg.tiers) : [];
}

Tree.fn.initTiers = function(tiers) {
	if ( ! (tiers instanceof Array)) return [];

	var self = this;

	return tiers.map(function(tier) {
		var tierObject = new Tier(self);
		tierObject.init(tier);

		return tierObject;
	});
}


/**
 * 更新階層並計算使用點數
 */
Tree.fn.updateStatus = function() {
	
	var usedPoint = 0;
	
	// 迴圈技能樹階層
	this.tiers.forEach(function(tier) {
		usedPoint = tier.updateStatus(usedPoint);
	});
	
	return this.used = usedPoint;
}

/**
 * 更新技能狀態
 */
Tree.fn.updateSkillStatus = function(leftPoint) {
	this.tiers.forEach(function(tier) {
		tier.updateSkillStatus(leftPoint);
	})
}

/**
 * 重設技能樹
 */
Tree.fn.unset = function(tree) {
	this.tiers[0].skills[0].unset();
	updateTreeUsedPoint(tree);
}
