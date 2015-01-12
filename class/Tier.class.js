/**
 * 技能階層類別
 */
function Tier(parent) {
	// 防止未經 new 建構類別
	if ( ! this instanceof Tier) return new Tier(parent);

	this._parent = parent;
	this.childList = [];

	this.tier		= -1;
	
	this.unlockRquire		= 0;
	this.unlockRquireImfamy	= 0;
	
	this.skillUnlockPointBasic	= 0;
	this.skillUnlockPointAce	= 0;
	
	this.skillUnlockCostBasic	= 0;
	this.skillUnlockCostAce		= 0;

	
	this.unlockPoint	= 0;
	this.toUnlock		= 0;
	this.unlockStatus	= false;
}

Tier.prototype = Object.create(SkillTreePrototype.prototype);
Tier.fn = Tier.prototype;


// ================================================================
// = 初始化
// ================================================================

Tier.fn.init = function(arg) {
	this.tier	= (typeof arg.tier === "number")? arg.tier : -1;	
	
	this.unlockRquire		= (typeof arg.unlockRquire		=== "number")? arg.unlockRquire : this.unlockRquire;
	this.unlockRquireImfamy	= (typeof arg.unlockRquireImfamy	=== "number")? arg.unlockRquireImfamy : this.unlockRquireImfamy;
	
	this.skillUnlockPointBasic	= (typeof arg.skillUnlockPointBasic === "number")? arg.skillUnlockPointBasic : this.skillUnlockPointBasic;
	this.skillUnlockPointAce	= (typeof arg.skillUnlockPointAce   === "number")? arg.skillUnlockPointAce : this.skillUnlockPointAce;
	
	this.skillUnlockCostBasic	= (typeof arg.skillUnlockCostBasic  === "number")? arg.skillUnlockCostBasic : this.skillUnlockCostBasic;
	this.skillUnlockCostAce		= (typeof arg.skillUnlockCostAce    === "number")? arg.skillUnlockCostAce : this.skillUnlockCostAce;

	if (typeof arg.skills !== "undefined") this.addChilds(arg.skills);
}

Tier.fn.initChild = function(arg) {
	var newInstance = new Skill(this);
	newInstance.init(arg);

	return newInstance;
}


// ================================================================
// = 更新狀態相關
// ================================================================

/**
 * 更新並計算消耗技能點
 */
Tier.fn.updateStatus = function(treeUsedPoint) {
	// 更新解鎖狀態
	this.unlockPoint = (this._parent.infamy)
		? this.unlockRquireImfamy
		: this.unlockRquire;
	this.toUnlock = this.unlockPoint - treeUsedPoint;
	this.unlockStatus = (this.toUnlock <= 0);
	
	if ( ! this.unlockStatus) return 0;

	// 計算該階層消耗技能點
	var tierUsedPoint = 0;
	this.loopChild(function(skill) {
		if (skill.ownBasic === true) tierUsedPoint += this.skillUnlockPointBasic;
		if (skill.ownAce === true) tierUsedPoint += this.skillUnlockPointAce;
	}, this);

	return tierUsedPoint;
}


// ================================================================
// = 責任鍊 > 更新狀態
// ================================================================

/**
 * 向下呼叫 更新技能樹
 */
Tier.fn.callChildsUpdateTree = function(treeUsedPoint) {
	return this.updateStatus(treeUsedPoint);
}