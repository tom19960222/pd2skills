/**
 * Infamy
 */
function InfamyTier(parent) {
	if ( ! this instanceof InfamyTier) return new InfamyTier(parent);
	InfamyPrototype.call(this);

	this._parent = parent;
	this.childList = [];

	this.tier = -1;
	this.unlockRequire	= 0;
	
	this.toUnlock		= 0;
	this.unlockStatus	= false;
}

InfamyTier.prototype = Object.create(InfamyPrototype.prototype);
InfamyTier.fn = InfamyTier.prototype;


// ================================================================
// = Methods
// ================================================================

InfamyTier.fn.init = function(arg) {
	if (typeof arg.talents !== "undefined") this.addChilds(arg.talents);

	this.tier = (typeof arg.tier === "number")? arg.tier : this.tier;
	this.unlockRequire = (typeof arg.unlockRequire  === "number")? arg.unlockRequire : this.unlockRequire;
}




InfamyTier.fn.addChilds = function(childs) {
	if ( ! (childs instanceof Array)) return;

	var self = this;
	childs.forEach(function(child) {
		self.initChild(child);
	});	
}

InfamyTier.fn.initChild = function(arg) {
	var newInstance = new Infamy(this);
	newInstance.init(arg);

	this.addChild(newInstance);
}

/**
 * 更新並計算消耗技能點
 */
InfamyTier.fn.updateStatus = function(countUsedPoint) {
	
	// 更新解鎖狀態
	this.toUnlock = this.unlockRequire - countUsedPoint;
	this.unlockStatus = (this.toUnlock <= 0);
	
	if (this.unlockStatus === true) {
		// 計算該階層消耗技能點
		this.loopChild(function(child) {
			if (child.owned === true) countUsedPoint += 1;
		});
	};

	return countUsedPoint;
}

// ================================================================
// = Methods
// ================================================================

InfamyTier.fn.callParentUpdate = function() {
	return this._parent.callParentUpdate(this.tier);
}

InfamyTier.fn.callChildsUpdateUsedPoint = function(countUsedPoint) {
	return this.updateStatus(countUsedPoint);
}

InfamyTier.fn.callChildsUpdateStatus = function(availablePoint) {
	this.loopChild(function(child) {
		child.callChildsUpdateStatus(availablePoint);
	});
}