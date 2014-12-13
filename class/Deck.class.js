/**
 * 牌類別
 */
function Deck(parentPerk) {
	// 防止未經 new 建構類別
	if ( ! this instanceof Deck) return new Deck(parentPerk);

	this._parentPerk = parentPerk;

	this.deck	= -1;
	this.name	= "";
	this.title	= "";
	this.text	= [];

	this.owned = false;
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

	this.owned	= false;
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

Deck.fn.isset = function() {
	return this.owned;
}

Deck.fn.unset = function() {
	this.owned = false;
}


// ================================================================
// = 呼叫上層相關
// ================================================================

Deck.fn.callSet = function() {
	this.callParentSet(this);
}

Deck.fn.callParentSet = function(target) {
	this._parentPerk.callParentSet(target); 
}