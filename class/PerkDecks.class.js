/**
 * 牌組類別
 */
function Perk(parentDecks) {
	// 防止未經 new 建構類別
	if ( ! this instanceof PerkDecks) return new PerkDecks(parentDecks);

	this._parentDecks = parentDecks;

	this.deck	= -1;
	this.name	= "";
	this.title	= "";
	this.decks	= [];
}

PerkDecks.fn = PerkDecks.prototype;


// ================================================================
// = 初始化
// ================================================================

PerkDecks.fn.init = function(arg) {
	this.deck	= (typeof arg.deck  === "number")? arg.deck		: -1;
	this.name	= (typeof arg.name  === "string")? arg.name		: "[undefined]";
	this.title	= (typeof arg.title === "string")? arg.title	: "[undefined]";
	this.decks	= (typeof arg.decks !== "undefined")? this.initDecks(arg.decks) : [];
}

PerkDecks.fn.initDecks = function(decks) {
	if ( ! (decks instanceof Array)) return [];
	
	var self = this;

	return decks.map(function(deck) {
		var deckObject = new Deck(self);
		deckObject.init(deck);

		return deckObject;
	});
}