/**
 * 額外牌組
 */
function PerkDecksCalculator(arg) {
	// 防止未經 new 建構類別
	if ( ! this instanceof PerkDecksCalculator) return new PerkDecksCalculator(arg);
	arg = arg || {}

	this.perks = [];
	this.init(arg);

	this.equipped = -1;
}

PerkDecksCalculator.fn = PerkDecksCalculator.prototype;


// ================================================================
// = 初始化
// ================================================================

PerkDecksCalculator.fn.init = function(arg) {
	this.perks = this.initPecks(arg);
}

PerkDecksCalculator.fn.initPecks = function(perks) {
	if ( ! (perks instanceof Array)) return [];
	
	var self = this;

	return perks.map(function(decks) {
		var perkObject = new Perk(self);
		perkObject.init(decks);

		return perkObject;
	});
}


// ================================================================
// = 存取
// ================================================================

PerkDecksCalculator.fn.updateStatus = function() {

	var perkIndex = -1;
	for (var i = 0; i < this.perks.length; i++) {
		if (this.perks[i].isset() === true) {
			perkIndex = i;
			break;
		}
	}

	this.equipped = perkIndex;
}

PerkDecksCalculator.fn.clear = function() {
	this.perks.forEach(function(perk) {
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
}


// ================================================================
// = 呼叫下層相關
// ================================================================

