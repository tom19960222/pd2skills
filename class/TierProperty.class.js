/**
 * TierProperty
 */
function TierProperty(arg) {
	if ( ! this instanceof TierProperty) return new TierProperty(arg);

	this.tier		= -1;
	
	this.unlockRquire			= 0;
	this.unlockRquireReduced	= 0;
	
	this.skillPointBasic	= 0;
	this.skillPointAce		= 0;
	
	this.skillCostBasic		= 0;
	this.skillCostAce		= 0;

	this.init(arg);
}

TierProperty.fn = TierProperty.prototype;


// ================================================================
// = 初始化
// ================================================================

TierProperty.fn.init = function(arg) {
	for (var property in this) {
		if (typeof arg[property] !== "undefined") this[property] = arg[property];
	}
}


// ================================================================
// = 請求 > 屬性
// ================================================================

/**
 * 請求花費
 */
TierProperty.fn.requestTierRequire = function(reduce) {
	if ( ! reduce) {
		return this.unlockRquire;
	} else {
		return this.unlockRquireReduced;
	}
}

/**
 * 請求階層技能點
 */
TierProperty.fn.requestTierSkillPoint = function(type) {
	switch (String(type).toLowerCase()) {
		case "basic" :
			return this.skillPointBasic;
		case "ace" :
			return this.skillPointAce;
		default :
			throw "undefined type : " + type;
	}
}

/**
 * 請求花費
 */
TierProperty.fn.requestTierSkillCost = function(type) {
	switch (String(type).toLowerCase()) {
		case "basic" :
			return this.skillCostBasic;
		case "ace" :
			return this.skillCostAce;
		default :
			throw "undefined type : " + type;
	}
}