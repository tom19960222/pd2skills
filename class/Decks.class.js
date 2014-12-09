/**
 * 牌組類別
 */
function Decks(parentDecks) {
	// 防止未經 new 建構類別
	if ( ! this instanceof Decks) return new Decks(parentDecks);

	this._parentDecks = parentDecks;

	this.deck	= -1;
	this.name	= "";
	this.title	= "";
	this.decks	= [];
}

Decks.fn = Decks.prototype;


// ================================================================
// = 初始化
// ================================================================

Decks.fn.init = function(arg) {
	this.deck	= (typeof arg.deck  === "number")? arg.deck		: -1;
	this.name	= (typeof arg.name  === "string")? arg.name		: "[undefined]";
	this.title	= (typeof arg.title === "string")? arg.title	: "[undefined]";
	this.decks	= (typeof arg.decks !== "undefined")? this.initDecks(arg.decks) : [];
}

Decks.fn.initDecks = function(decks) {
	if ( ! (decks instanceof Array)) return [];
	
	var self = this;

	return decks.map(function(deck) {
		var deckObject = new Deck(self);
		deckObject.init(deck);

		return deckObject;
	});
}