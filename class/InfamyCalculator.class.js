/**
 * Infamy
 */
function InfamyCalculator(arg) {
	// 防止未經 new 建構類別
	if ( ! this instanceof InfamyCalculator) return new InfamyCalculator(arg);

	this._skillsCalculator = null;

	this.childList = [];
	
	this.totalPoint	= 5;
	this.usedPoint	= 0;

	this.init(arg);
}

InfamyCalculator.prototype = Object.create(InfamyPrototype.prototype);
InfamyCalculator.fn = InfamyCalculator.prototype;


// ================================================================
// = Init
// ================================================================

InfamyCalculator.fn.init = function(arg) {
	if (typeof arg === "undefined") return;

	if (typeof arg.tiers !== "undefined") this.addChilds(arg.tiers);
}

InfamyCalculator.fn.initChild = function(arg) {
	var newInstance = new InfamyTier(this);
	newInstance.init(arg);

	return newInstance;
}


InfamyCalculator.fn.setSkillsCalculator = function(skillsCalculator) {
	this._skillsCalculator = skillsCalculator;
}


// ================================================================
// = Methods
// ================================================================

InfamyCalculator.fn.updateStatus = function() {
	// 更新階層狀態
	this.usedPoint = this.callChildsUpdateUsedPoint();
	// 更新技能狀態
	this.callChildsUpdateStatus(this.getAvailablePoint());
}

/**
 * 取得可用技能點
 */
InfamyCalculator.fn.getAvailablePoint = function() {
	return this.totalPoint - this.usedPoint;
}


// ================================================================
// = Hash
// ================================================================

InfamyCalculator.fn.encode = function() {
	return;
}

InfamyCalculator.fn.decode = function(hash) {

}

// ================================================================
// = Chain of Responsibility
// ================================================================

InfamyCalculator.fn.callParentUpdate = function(calledByTier) {
	this.updateStatus();
}

InfamyCalculator.fn.callChildsUpdateUsedPoint = function() {
	var countUsedPoint = 0;

	this.loopChild(function(child) {
		countUsedPoint = child.updateStatus(countUsedPoint);
	});

	return countUsedPoint;
}

InfamyCalculator.fn.callChildsUpdateStatus = function(availablePoint) {
	this.loopChild(function(child) {
		child.callChildsUpdateStatus(availablePoint);
	});
}