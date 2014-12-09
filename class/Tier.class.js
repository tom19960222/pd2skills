/**
 * 技能階層類別
 */
function Tier(parentTree) {
	// 防止未經 new 建構類別
	if ( ! this instanceof Tier) return new Tier(parentTree);

	this._parentTree = parentTree;

	this.tier		= -1;
	this.skills 	= [];
	
	this.tierUnlockPoint		= 0;
	this.tierUnlockPointImfamy	= 0;
	
	this.skillUnlockPointBasic	= 0;
	this.skillUnlockPointAce	= 0;
	
	this.skillUnlockCostBasic	= 0;
	this.skillUnlockCostAce		= 0;
	
	this.unlockPoint	= 0;
	this.unlockRequire	= 0;
	this.unlockStatus	= false;
}

Tier.fn = Tier.prototype;


// ================================================================
// = 初始化
// ================================================================

Tier.fn.init = function(arg) {
	this.tier	= (typeof arg.tier === "number")? arg.tier : -1;
	this.skills	= (typeof arg.skills !== "undefined")
		? this.initSkills(arg.skills)
		: [];
	
	this.tierUnlockPoint		= (typeof arg.tierUnlockPoint		=== "number")? arg.tierUnlockPoint : 0;
	this.tierUnlockPointImfamy	= (typeof arg.tierUnlockPointImfamy	=== "number")? arg.tierUnlockPointImfamy : 0;
	
	this.skillUnlockPointBasic	= (typeof arg.skillUnlockPointBasic === "number")? arg.skillUnlockPointBasic : 0;
	this.skillUnlockPointAce	= (typeof arg.skillUnlockPointAce   === "number")? arg.skillUnlockPointAce : 0;
	
	this.skillUnlockCostBasic	= (typeof arg.skillUnlockCostBasic  === "number")? arg.skillUnlockCostBasic : 0;
	this.skillUnlockCostAce		= (typeof arg.skillUnlockCostAce    === "number")? arg.skillUnlockCostAce : 0;
}

Tier.fn.initSkills = function(skills) {
	if ( ! (skills instanceof Array)) return [];
	
	var self = this;

	return skills.map(function(skill) {
		var skillObject = new Skill(self);
		skillObject.init(skill);

		return skillObject;
	});
}


// ================================================================
// = 更新狀態相關
// ================================================================

/**
 * 更新並計算消耗技能點
 */
Tier.fn.updateStatus = function(countTreeUsedPoint) {
	var self = this;
	
	// 更新解鎖狀態
	this.unlockPoint = (this._parentTree.infamy)
		? this.tierUnlockPointImfamy
		: this.tierUnlockPoint;
	this.unlockRequire = this.unlockPoint - countTreeUsedPoint;
	this.unlockStatus = (this.unlockRequire <= 0);
	
	if (this.unlockStatus === true) {
		// 計算該階層消耗技能點
		this.skills.forEach(function(skill) {
			if (skill.ownBasic === true) countTreeUsedPoint += self.skillUnlockPointBasic;
			if (skill.ownAce === true) countTreeUsedPoint += self.skillUnlockPointAce;
		});
	};

	return countTreeUsedPoint;
}


// ================================================================
// = 呼叫上層相關
// ================================================================

/**
 * 呼叫上層更新
 */
Tier.fn.callParentUpdate = function() {
	this._parentTree.callParentUpdate();
}

/**
 * 向上呼叫設定技能指標
 */
Tier.fn.callParentSetPointer = function(pointerName) {
	return this._parentTree.callParentSetPointer(pointerName);
}

/**
 * 向上呼叫設定技能指標清單
 */
Tier.fn.callParentSetPointerList = function(pointerName, skill) {
	this._parentTree.callParentSetPointerList(pointerName, skill);
}


// ================================================================
// = 呼叫下層相關
// ================================================================

/**
 * 更新技能狀態
 */
Tier.fn.updateSkillStatus = function(leftPoint) {
	this.skills.forEach(function(skill) {
		skill.updateSkillStatus(leftPoint);
	});
}

/**
 * 向下呼叫建立指標清單
 */
Tier.fn.bulidPointerList = function(skillNameList) {
	this.skills.forEach(function (skill) {
		skill.bulidPointerList(skillNameList);
	});
}