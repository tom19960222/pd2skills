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

Tier.fn.init = function(arg) {
	this.tier	= (typeof arg.tier !== "undefined")? arg.tier : -1;
	this.skills	= (typeof arg.skills !== "undefined")? this.initSkills(arg.skills) : [];
	
	this.tierUnlockPoint		= (typeof arg.tierUnlockPoint !== "undefined")? arg.tierUnlockPoint : 0;
	this.tierUnlockPointImfamy	= (typeof arg.tierUnlockPointImfamy !== "undefined")? arg.tierUnlockPointImfamy : 0;
	
	this.skillUnlockPointBasic	= (typeof arg.skillUnlockPointBasic !== "undefined")? arg.skillUnlockPointBasic : 0;
	this.skillUnlockPointAce	= (typeof arg.skillUnlockPointAce   !== "undefined")? arg.skillUnlockPointAce : 0;
	
	this.skillUnlockCostBasic	= (typeof arg.skillUnlockCostBasic  !== "undefined")? arg.skillUnlockCostBasic : 0;
	this.skillUnlockCostAce		= (typeof arg.skillUnlockCostAce    !== "undefined")? arg.skillUnlockCostAce : 0;
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

/**
 * 呼叫上層更新
 */
Tier.fn.callParentUpdate = function() {
	this._parentTree.callParentUpdate();
}


/**
 * 更新並計算消耗技能點
 */
Tier.fn.updateStatus = function(countUsedPoint) {
	var self = this;
	
	// 更新解鎖狀態
	this.unlockPoint = (this._parentTree.infamy)
		? this.tierUnlockPointImfamy
		: this.tierUnlockPoint;
	this.unlockRequire = this.unlockPoint - countUsedPoint;
	this.unlockStatus = (this.unlockRequire <= 0);
	
	if (this.unlockStatus === true) {
		// 計算該階層消耗技能點
		this.skills.forEach(function(skill) {
			if (skill.ownBasic === true) countUsedPoint += self.skillUnlockPointBasic;
			if (skill.ownAce === true) countUsedPoint += self.skillUnlockPointAce;
		});
	}

	return countUsedPoint;
}

/**
 * 更新技能狀態
 */
Tier.fn.updateSkillStatus = function(leftPoint) {
	this.skills.forEach(function(skill) {
		skill.updateStatus(leftPoint);
	});
}