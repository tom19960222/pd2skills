/**
 * 計算機類別
 */
function SkillsCalculator(arg, tierDictionary) {
	// 防止未經 new 建構類別
	if ( ! this instanceof SkillsCalculator) return new SkillsCalculator(arg, tierDictionary);
	SkillTreePrototype.call(this);

	this._tierDictionary = null;
	this.pointerList = {};

	this.totalPoint = 120;
	this.spendPoint = 0;

	this.costReduced = true;
	this.spendCost = 0;

	this.init(arg, tierDictionary);
}

SkillsCalculator.prototype = Object.create(SkillTreePrototype.prototype);
SkillsCalculator.fn = SkillsCalculator.prototype;


// ================================================================
// = 初始化
// ================================================================

/**
 * 初始化
 */
SkillsCalculator.fn.init = function(arg, tierDictionary) {
	if (typeof arg === "undefined") return;

	this.initTierDictionary(tierDictionary);

	this.addChilds(arg);
	this.bulidPointerList();

	this.updateStatus();
}

/**
 * 初始化 Child
 */
SkillsCalculator.fn.initChild = function(arg) {
	return new Tree(this, arg);
}

/**
 * 初始化 TierDictionary
 */
SkillsCalculator.fn.initTierDictionary = function(arg) {
	this._tierDictionary = new TierDictionary(arg);
}


// ================================================================
// = 設定
// ================================================================

/**
 * 設定惡名
 */
SkillsCalculator.fn.setInfamy = function(infamyStatus) {
	this.loopChild(function(tree, index) {
		tree.setInfamy(infamyStatus[index] || false);
	});
}

/**
 * 設定花費減免
 */
SkillsCalculator.fn.costReduce = function(status) {
	if (typeof status === "boolean") {
		this.costReduced = status;

		this.updateSkillCost();

		this.updateTreeSpendCost();
		this.updateSpendCost();
	}

	return this.costReduced;
}

/**
 * 取得可用技能點
 */
SkillsCalculator.fn.getAvailablePoint = function() {
	return this.totalPoint - this.spendPoint;
}

/**
 * 重設技能
 */
SkillsCalculator.fn.unset = function() {
	this.loopChild(function(tree) {
		tree.unset();
	});
}


// ================================================================
// = 更新
// ================================================================

/**
 * 更新
 */
SkillsCalculator.fn.updateStatus = function() {
	// 更新技能樹
	this.updateTreeStatus();
	this.updateSpendPoint();

	// 更新技能
	this.callChildUpdateSkill(this.getAvailablePoint());

	// 更新花費
	this.updateTreeSpendCost();
	this.updateSpendCost();
}

/**
 * 更新所有技能樹
 */
SkillsCalculator.fn.updateTreeStatus = function() {
	this.loopChild(function(child) {
		child.updateStatus();
	});
}

/**
 * 更新花費費用
 */
SkillsCalculator.fn.updateTreeSpendCost = function() {
	this.loopChild(function(child) {
		child.updateSpendCost();
	});
}


// ================================================================
// = 計算點數與費用
// ================================================================

/**
 * 更新技能點
 */
SkillsCalculator.fn.updateSpendPoint = function() {
	this.spendPoint = this.$getSpendPoint();
}

/**
 * 更新花費
 */
SkillsCalculator.fn.updateSpendCost = function(renew) {
	this.spendCost = this.$getSpendCost();
}

/**
 * 取得技能點
 */
SkillsCalculator.fn.$getSpendPoint = SkillsCalculator.fn.getSpendPoint;
SkillsCalculator.fn.getSpendPoint = function(renew) {
	if (renew === true) this.updateSpendPoint();
	return this.spendPoint;
}

/**
 * 取得花費
 */
SkillsCalculator.fn.$getSpendCost = SkillsCalculator.fn.getSpendCost;
SkillsCalculator.fn.getSpendCost = function(renew) {
	if (renew === true) this.updateSpendCost();
	return this.spendCost;
}


// ================================================================
// = Pointer
// ================================================================

/**
 * 設定技能指標
 */
SkillsCalculator.fn.initPointer = function (pointerName) {
	// 初始化指標
	if (typeof this.pointerList[pointerName] === "undefined") {
		this.pointerList[pointerName] = new Pointer;
	}

	return this.pointerList[pointerName];
}

/**
 * 新增至技能指標清單
 */
SkillsCalculator.fn.setPointer = function(pointerName, skill) {
	if (typeof this.pointerList[pointerName] === "undefined")
		throw "未定義指標: " + pointerName;

	this.pointerList[pointerName].setTarget(skill);
}

/**
 * 建立技能指標清單
 */
SkillsCalculator.fn.bulidPointerList = function() {

	var skillNameList = [];
	for (var skillName in this.pointerList) {
		skillNameList.push(skillName);
	}
	
	this.callChildBulidPointerList(skillNameList);
}


// ================================================================
// = 責任鍊 > 更新狀態
// ================================================================

/**
 * 向上呼叫 更新
 */
SkillsCalculator.fn.callParentUpdate = function(tree) {

	// 更新樹
	tree.updateStatus();
	this.updateSpendPoint();

	// 更新技能狀態
	this.callChildUpdateSkill(this.getAvailablePoint());

	// 更新技能花費
	tree.updateSpendCost();
	this.updateSpendCost();
}

/**
 * 向下呼叫 更新技能樹
 */
SkillsCalculator.fn.callChildsUpdateTree = function () {
	this.loopChild(function(child) {
		child.callChildsUpdateTree();
	});
}

/**
 * 向下呼叫 更新花費
 */
SkillsCalculator.fn.callChildsUpdateCost = function () {
	this.loopChild(function(child) {
		child.callChildsUpdateCost();
	});
}

// ================================================================
// = 責任鍊 > 指標
// ================================================================

/**
 * 向上呼叫 初始指標
 */
SkillsCalculator.fn.callParentInitPointer = function(pointerName) {
	return this.initPointer(pointerName);
}

/**
 * 向上呼叫 設定指標
 */
SkillsCalculator.fn.callParentSetPointer = function(pointerName, skill) {
	this.setPointer(pointerName, skill);
}


// ================================================================
// = 請求 > 屬性
// ================================================================

/**
 * 請求階層解鎖需求
 */
SkillsCalculator.fn.requestTierRequire = function(tier, reduce) {
	return this._tierDictionary.requestTierRequire(tier, reduce);
}

/**
 * 請求階層技能點
 */
SkillsCalculator.fn.requestTierSkillPoint = function(type, tier) {
	return this._tierDictionary.requestTierSkillPoint(type, tier);
}

/**
 * 請求階層技能費用
 */
SkillsCalculator.fn.requestTierSkillCost = function(type, tier, reduce) {
	return this._tierDictionary.requestTierSkillCost(type, tier, this.costReduce());
}


// ================================================================
// = Storage
// ================================================================

SkillsCalculator.fn.setStorage = function(storage) {
	this._storage = storage;
}

SkillsCalculator.fn.save = function(storage) {
	this.loopChild(function(child) {
		child.save(storage);
	});
}

SkillsCalculator.fn.load = function(storage) {
	this.loopChild(function(child) {
		child.load(storage);
	});

	this.updateStatus(true);
}