/**
 * 額外牌組
 */
function PerkDecksCalculator(arg) {
	// 防止未經 new 建構類別
	if ( ! this instanceof PerkDecksCalculator) return new PerkDecksCalculator(arg);

	this.perks = [];
}

PerkDecksCalculator.fn = PerkDecksCalculator.prototype;


// ================================================================
// = 初始化
// ================================================================

PerkDecksCalculator.fn.init = function(arg) {
	this.pecks	= (typeof arg.pecks !== "undefined")? this.initPecks(arg.pecks) : [];
}

PerkDecksCalculator.fn.initPecks = function(pecks) {
	if ( ! (pecks instanceof Array)) return [];
	
	var self = this;

	return pecks.map(function(decks) {
		var perkObject = new Perk(self);
		perkObject.init(decks);

		return perkObject;
	});
}