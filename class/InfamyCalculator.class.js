/**
 * Infamy
 */
function InfamyCalculator(arg) {
	// 防止未經 new 建構類別
	if ( ! this instanceof InfamyCalculator) return new InfamyCalculator(arg);

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
// = Methods
// ================================================================

InfamyCalculator.fn.getInfamyStatus = function() {
	
	var tier1 = this.getChild(1);
	var infamyStatus = tier1.loopChild(function(child) {
		return child.owned;
	});

	var no5 = false;
	infamyStatus.forEach(function(status) {
		no5 = (no5 || status);
	});

	infamyStatus.push(no5);

	return infamyStatus;
}


// ================================================================
// = Storage
// ================================================================

InfamyCalculator.fn.save = function(storage) {
	return storage;
}

InfamyCalculator.fn.load = function(storage) {

}


// ================================================================
// = Call
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