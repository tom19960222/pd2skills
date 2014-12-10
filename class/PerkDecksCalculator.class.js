/**
 * 額外牌組
 */
function PerkDecksCalculator(arg) {
	// 防止未經 new 建構類別
	if ( ! this instanceof PerkDecksCalculator) return new PerkDecksCalculator(arg);
	arg = arg || {}

	this.perks = [];
	this.init(arg);
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