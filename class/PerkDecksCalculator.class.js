/**
 * 額外牌組
 */
function PerkDecksCalculator(arg) {
	// 防止未經 new 建構類別
	if ( ! this instanceof PerkDecksCalculator) return new PerkDecksCalculator(arg);

	this.childList = [];

	this.init(arg);
	this.equipped = -1;
}

PerkDecksCalculator.prototype = Object.create(PerkDecksPrototype.prototype);
PerkDecksCalculator.fn = PerkDecksCalculator.prototype;


// ================================================================
// = 初始化
// ================================================================

PerkDecksCalculator.fn.init = function(arg) {
	if (typeof arg === "undefined") return;

	this.addChilds(arg);
}

PerkDecksCalculator.fn.initChild = function(arg) {
	var newInstance = new Perk(this);
	newInstance.init(arg);

	return newInstance;
}


// ================================================================
// = 存取
// ================================================================

PerkDecksCalculator.fn.updateStatus = function() {
	this.loopChild(function(perk, index) {
		if (perk.isset()) this.equipped = index;
	}, this);
}

PerkDecksCalculator.fn.getEquippedPerk = function() {
	if (this.equipped == -1) return null;
	if (typeof this.childList[this.equipped] === "undefined") return null;
	
	return this.childList[this.equipped];
}

PerkDecksCalculator.fn.clear = function() {
	this.loopChild(function(perk) {
		perk.clear();
		perk.unset();
	});
}


// ================================================================
// = 呼叫上層相關
// ================================================================

PerkDecksCalculator.fn.callParentSet = function(targetPerk) {
	this.clear();

	targetPerk.set();
	this.updateStatus();
}


// ================================================================
// = 呼叫下層相關
// ================================================================

