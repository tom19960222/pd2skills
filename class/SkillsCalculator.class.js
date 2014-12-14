/**
 * 計算機類別
 */
function SkillsCalculator(arg) {
	// 防止未經 new 建構類別
	if ( ! this instanceof SkillsCalculator) return new SkillsCalculator(arg);
	arg = arg || {};

	this.total	= 120;
	this.used	= 0;

	this.trees	= [];

	this.pointers = {};

	this.init(arg);
}

SkillsCalculator.fn = SkillsCalculator.prototype;


// ================================================================
// = 初始化
// ================================================================
SkillsCalculator.fn.init = function(arg) {
	this.trees = this.initTrees(arg);
	this.initPointers();
}


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
 * 初始化技能指標清單
 */
SkillsCalculator.fn.initPointers = function() {
	this.bulidPointerList();
}


// ================================================================
// = 更新狀態相關
// ================================================================

/**
 * 更新所有技能樹與技能
 */
SkillsCalculator.fn.updateStatus = function() {
	// 更新階層狀態
	this.used = this.updateTreeStatus();
	// 更新技能狀態
	this.updateSkillStatus(this.getAvailablePoint());
}

/**
 * 取得已使用技能點
 */
SkillsCalculator.fn.getUsedPoint = function(bool) {
	// 更新 used point
	if (bool === true) {
		var countUsedPoint = 0;

		this.trees.forEach(function(tree) {
			countUsedPoint += tree.used;
		});

		this.used = countUsedPoint;
	}

	return this.used;
}

/**
 * 取得可用技能點
 */
SkillsCalculator.fn.getAvailablePoint = function() {
	return this.total - this.used;
}


// ================================================================
// = 技能指標相關
// ================================================================

/**
 * 設定技能指標
 */
SkillsCalculator.fn.setSkillPointer = function (pointerName) {
	// 初始化指標
	if (typeof this.pointers[pointerName] === "undefined") {
		this.pointers[pointerName] = {"skill" : {}};
	}

	return this.pointers[pointerName];
}

/**
 * 建立技能指標清單
 */
SkillsCalculator.fn.bulidPointerList = function() {
	var self = this;

	var skillNameList = [];
	for (var skillName in this.pointers) skillNameList.push(skillName);
	
	this.trees.forEach(function(tree) {
		tree.bulidPointerList(skillNameList);
	});
}

/**
 * 新增至技能指標清單
 */
SkillsCalculator.fn.pushPointerList = function(pointerName, skill) {
	if (typeof this.pointers[pointerName] === "undefined") throw Exception("指標未定義"); 
	this.pointers[pointerName].skill = skill;
}


// ================================================================
// = 呼叫上層相關
// ================================================================

/**
 * 呼叫上層更新
 * 重新取得已使用點數, 並更新技能
 */
SkillsCalculator.fn.callParentUpdate = function() {
	this.getUsedPoint(true);
	this.updateSkillStatus(this.getAvailablePoint());
}

/**
 * 向上呼叫設定技能指標
 */
SkillsCalculator.fn.callParentSetPointer = function(pointerName) {
	return this.setSkillPointer(pointerName);
}

/**
 * 向上呼叫設定技能指標清單
 */
SkillsCalculator.fn.callParentSetPointerList = function(pointerName, skill) {
	this.pushPointerList(pointerName, skill);
}


// ================================================================
// = 呼叫下層相關
// ================================================================

/**
 * 向下更新技能樹
 */
SkillsCalculator.fn.updateTreeStatus = function () {
	var countUsedPoint = 0;

	// 更新階層狀態
	this.trees.forEach(function(tree) {
		countUsedPoint += tree.updateStatus();
	});

	return countUsedPoint;
}

/**
 * 向下更新技能
 */
SkillsCalculator.fn.updateSkillStatus = function (available) {
	this.trees.forEach(function(tree) {
		tree.updateSkillStatus(available);
	});
}