/**
 * SkillTree Prototype
 */
function SkillTreePrototype(parent) {
	if ( ! this instanceof SkillTreePrototype) return new SkillTreePrototype(parent);
	Composite.call(this);

	this._parent = parent;
}

SkillTreePrototype.prototype = Object.create(Composite.prototype);
SkillTreePrototype.fn = SkillTreePrototype.prototype;


// ================================================================
// = 取得
// ================================================================

/**
 * 取得花費技能點
 */
SkillTreePrototype.fn.getSpendPoint = function() {
	var count = 0;
	this.loopChild(function(child) {
		count += child.getSpendPoint();
	});

	return count;
}

/**
 * 取得花費費用
 */
SkillTreePrototype.fn.getSpendCost = function() {
	var count = 0;
	this.loopChild(function(child) {
		count += child.getSpendCost();
	});

	return count;
}


// ================================================================
// = 更新階層屬性
// ================================================================

SkillTreePrototype.fn.updateTierRequire = function() {
	this.loopChild(function(child) {
		child.updateTierRequire();
	});
}

SkillTreePrototype.fn.updateSkillPoint = function() {
	this.loopChild(function(child) {
		child.updateSkillPoint();
	});
}


SkillTreePrototype.fn.updateSkillCost = function() {
	this.loopChild(function(child) {
		child.updateSkillCost();
	});
}


// ================================================================
// = 請求 > 屬性
// ================================================================

/**
 * 請求階層解鎖需求
 */
SkillTreePrototype.fn.requestTierRequire = function(tier, reduce) {
	return this._parent.requestTierRequire(tier, reduce);
}

/**
 * 請求階層技能點
 */
SkillTreePrototype.fn.requestTierSkillPoint = function(type, tier) {
	return this._parent.requestTierSkillPoint(type, tier);
}

/**
 * 請求階層技能費用
 */
SkillTreePrototype.fn.requestTierSkillCost = function(type, tier, reduce) {
	return this._parent.requestTierSkillCost(type, tier, reduce);
}


// ================================================================
// = 呼叫 > 更新狀態
// ================================================================

/**
 * 向上 更新
 */
SkillTreePrototype.fn.callParentUpdate = function() {
	this._parent.callParentUpdate();
}


/**
 * 向下 更新技能
 */
SkillTreePrototype.fn.callChildUpdateSkill = function (availablePoint) {
	this.loopChild(function(child) {
		child.callChildUpdateSkill(availablePoint);
	});
}


// ================================================================
// = 呼叫 > 指標
// ================================================================

/**
 * 向上 初始指標
 */
SkillTreePrototype.fn.callParentInitPointer = function(pointerName) {
	return this._parent.callParentInitPointer(pointerName);
}

/**
 * 向上 設定指標
 */
SkillTreePrototype.fn.callParentSetPointer = function(pointerName, skill) {
	this._parent.callParentSetPointer(pointerName, skill)
}

/**
 * 向下 建立指標清單
 */
SkillTreePrototype.fn.callChildBulidPointerList = function(nameList) {
	this.loopChild(function(child) {
		child.callChildBulidPointerList(nameList);
	});
}