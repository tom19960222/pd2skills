/**
 * TierDictionary
 */
function TierDictionary(arg) {
	if ( ! this instanceof TierDictionary) return new TierDictionary(arg);
	Composite.call(this);

	this.index = {};

	this.init(arg);
}

TierDictionary.prototype = Object.create(Composite.prototype);
TierDictionary.fn = TierDictionary.prototype;


// ================================================================
// = 初始化
// ================================================================

TierDictionary.fn.init = function(arg) {
	this.addChilds(arg);
	this.bulidIndex();
}

TierDictionary.fn.initChild = function(arg) {
	return new TierProperty(arg);
}

// ================================================================
// = 索引
// ================================================================

TierDictionary.fn.bulidIndex = function() {
	this.loopChild(function(child) {
		this.setIndex(child.tier, child);
	}, this);
}

TierDictionary.fn.setIndex = function(key, value) {
	this.index[key] = value;
}

TierDictionary.fn.getIndex = function(key) {
	return this.index[key];
}


// ================================================================
// = 索引
// ================================================================

TierDictionary.fn.getTierProperty = function(index) {
	var tierProperty = this.getIndex(index);
	if ( ! tierProperty) throw "Can't find tier index : " + index;

	return tierProperty;
}


// ================================================================
// = 請求 > 屬性
// ================================================================

/**
 * 請求花費
 */
TierDictionary.fn.requestTierRequire = function(tier, reduce) {
	return this.getTierProperty(tier).requestTierRequire(reduce);
}

/**
 * 請求階層技能點
 */
TierDictionary.fn.requestTierSkillPoint = function(type, tier) {
	return this.getTierProperty(tier).requestTierSkillPoint(type);
}

/**
 * 請求花費
 */
TierDictionary.fn.requestTierSkillCost = function(type, tier, reduce) {
	var cost;
	cost = this.getTierProperty(tier).requestTierSkillCost(type);
	cost = (reduce === true)? Math.round(cost * 0.75) : cost;

	return cost;
}