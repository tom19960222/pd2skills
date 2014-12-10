/**
 * 牌類別
 */
function Deck(parentDecks) {
	// 防止未經 new 建構類別
	if ( ! this instanceof Deck) return new Deck(parentDecks);

	this._parentDecks = parentDecks;

	this.deck	= -1;
	this.name	= "";
	this.title	= "";
	this.text	= [];
}

Deck.fn = Deck.prototype;


// ================================================================
// = 初始化
// ================================================================

Deck.fn.init = function(arg) {
	this.deck	= (typeof arg.deck  === "number")? arg.deck		: -1;
	this.name	= (typeof arg.name  === "string")? arg.name		: "[undefined]";
	this.title	= (typeof arg.title === "string")? arg.title	: "[undefined]";
	this.text	= (typeof arg.text !== "undefined")? this.initText(arg.text) : [];
}

Deck.fn.initText = function(text) {
	if ( ! (text instanceof Array)) return [];
	
	return text.map(function(part) {
		if (typeof part === "string") return part;
	});
}