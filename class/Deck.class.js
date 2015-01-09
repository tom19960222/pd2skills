/**
 * 牌類別
 */
function Deck(parent) {
	// 防止未經 new 建構類別
	if ( ! this instanceof Deck) return new Deck(parent);

	this._parent = parent;

	this.deck	= -1;
	this.name	= "[undefined]";
	this.title	= "[undefined]";
	this.text	= [];

	this.owned = false;
}

Deck.prototype = Object.create(PerkDecksPrototype.prototype);
Deck.fn = Deck.prototype;


// ================================================================
// = 初始化
// ================================================================

Deck.fn.init = function(arg) {
	this.deck	= (typeof arg.deck  === "number")? arg.deck		: this.deck;
	this.name	= (typeof arg.name  === "string")? arg.name		: this.name;
	this.title	= (typeof arg.title === "string")? arg.title	: this.title;
	this.text	= (typeof arg.text !== "undefined")? this.initText(arg.text) : this.text;
}

Deck.fn.initText = function(text) {
	if ( ! (text instanceof Array)) return [];
	
	return text.map(function(part) {
		if (typeof part === "string") return part;
	});
}


// ================================================================
// = 存取 
// ================================================================

Deck.fn.set = function() {
	this.owned = true;
}

Deck.fn.unset = function() {
	this.owned = false;
}

Deck.fn.isset = function() {
	return this.owned;
}


// ================================================================
// = 存取 
// ================================================================

Deck.fn.choice = function() {
	this.callParentSet(this);
}