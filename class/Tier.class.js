/**
 * 技能階層類別
 */
function Tier(parent, arg) {
	// 防止未經 new 建構類別
	if ( ! this instanceof Tier) return new Tier(parent, arg);
	SkillTreePrototype.call(this, parent);

	this.tier = -1;

	this.unlockRequire		= 0;

	this.skillPointBasic	= 0;
	this.skillPointAce		= 0;

	this.skillCostBasic		= 0;
	this.skillCostAce		= 0;

	this.unlockNeeded	= 0;
	this.unlockStatus	= false;

	this.init(arg);
}

Tier.prototype = Object.create(SkillTreePrototype.prototype);
Tier.fn = Tier.prototype;


// ================================================================
// = 初始化
// ================================================================

Tier.fn.init = function(arg) {
	if ( ! arg) return;

	this.tier = (typeof arg.tier === "number")? arg.tier : this.tier;

	if (typeof arg.skills !== "undefined") this.addChilds(arg.skills);
	this.initProperty();
}

Tier.fn.initChild = function(arg) {
	return new Skill(this, arg);
}

Tier.fn.initProperty = function() {
	this.updateTierRequire();
	this.updateSkillPoint();
	this.updateSkillCost();
}


// ================================================================
// = 更新狀態相關
// ================================================================

/**
 * 更新
 */
Tier.fn.updateStatus = function(usedPointCount) {
	
	this.updateUnlockStatus(usedPointCount);
	if ( ! this.unlockStatus) return 0;

	return this.getSpendPoint();
}

/**
 * 更新解鎖狀態
 */
Tier.fn.updateUnlockStatus = function(usedPointCount) {
	// 更新解鎖狀態
	this.unlockNeeded = this.unlockRequire - usedPointCount;
	this.unlockStatus = (this.unlockNeeded <= 0);
}

/**
 * 回傳是否解鎖
 */
Tier.fn.isUnlocked = function() {
	return this.unlockStatus;
}


// ================================================================
// = 更新階層屬性
// ================================================================

Tier.fn.updateTierRequire = function() {
	this.unlockRequire	= this.requestTierRequire();
}

Tier.fn.updateSkillPoint = function() {
	this.skillPointBasic	= this.requestTierSkillPoint("basic");
	this.skillPointAce		= this.requestTierSkillPoint("ace")
}


Tier.fn.updateSkillCost = function() {
	this.skillCostBasic	= this.requestTierSkillCost("basic");
	this.skillCostAce	= this.requestTierSkillCost("ace")
}


// ================================================================
// = 呼叫 > 更新狀態
// ================================================================

/**
 * 向下呼叫 更新技能樹
 */
Tier.fn.callChildsUpdateTree = function(usedPointCount) {
	return this.updateStatus(usedPointCount);
}

/**
 * 向下呼叫 更新花費
 */
Tier.fn.callChildsUpdateCost = function () {
	return this.getCost();
}


// ================================================================
// = 請求 > 屬性
// ================================================================

/**
 * 請求階層解鎖需求
 */
Tier.fn.requestTierRequire = function(tier, reduce) {
	return this._parent.requestTierRequire(this.tier, reduce);
}

/**
 * 請求階層技能點
 */
Tier.fn.requestTierSkillPoint = function(type, tier) {
	return this._parent.requestTierSkillPoint(type, this.tier);
}

/**
 * 請求階層技能費用
 */
Tier.fn.requestTierSkillCost = function(type, tier, reduce) {
	return this._parent.requestTierSkillCost(type, this.tier, reduce);
}