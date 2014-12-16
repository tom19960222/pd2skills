/**
 * 技能樹類別
 */
function Tree(parentTrees) {
	// 防止未經 new 建構類別
	if ( ! this instanceof Tree) return new Tree(parentTrees);

	this._parentTrees = parentTrees;

	this.name	= "";
	this.title	= "";
	this.text	= "";

	this.tiers	= [];
	this.used	= 0;
	this.infamy = false;
}

Tree.fn = Tree.prototype;


// ================================================================
// = 初始化
// ================================================================

Tree.fn.init = function(arg) {
	this.name	= (typeof arg.name	=== "string")? arg.name	: "[undefined]";
	this.title	= (typeof arg.title	=== "string")? arg.title	: "[undefined]";
	this.text	= (typeof arg.text	=== "string")? arg.text	: "[undefined]";

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


// ================================================================
// = 更新狀態相關
// ================================================================

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
 * 重設技能樹
 */
Tree.fn.unset = function(tree) {
	this.tiers[0].skills[0].unset();
}

/**
 * 設定惡名
 */
Tree.fn.setInfamy = function(bool) {
	if (typeof bool !== "boolean") return false;
	if (this.infamy !== bool) {
		this.infamy = bool;
		this.callParentUpdate();
	};
}


// ================================================================
// = 呼叫上層相關
// ================================================================

/**
 * 呼叫上層更新
 */
Tree.fn.callParentUpdate = function() {
	this.updateStatus();
	this._parentTrees.callParentUpdate();
}

/**
 * 向上呼叫設定技能指標
 */
Tree.fn.callParentSetPointer = function(pointerName) {
	return this._parentTrees.callParentSetPointer(pointerName);
}

/**
 * 向上呼叫設定技能指標清單
 */
Tree.fn.callParentSetPointerList = function(pointerName, skill) {
	this._parentTrees.callParentSetPointerList(pointerName, skill);
}


// ================================================================
// = 呼叫下層相關
// ================================================================

/**
 * 更新技能狀態
 */
Tree.fn.updateSkillStatus = function(leftPoint) {
	this.tiers.forEach(function(tier) {
		tier.updateSkillStatus(leftPoint);
	});
}

/**
 * 向下呼叫建立指標清單
 */
Tree.fn.bulidPointerList = function(skillNameList) {
	this.tiers.forEach(function (tier) {
		tier.bulidPointerList(skillNameList);
	});
}