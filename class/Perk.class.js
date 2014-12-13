/**
 * 牌組類別
 */
function Perk(parentPerks) {
	// 防止未經 new 建構類別
	if ( ! this instanceof Perk) return new Perk(parentPerks);

	this._parentPerks = parentPerks;

	this.name	= "";
	this.title	= "";
	this.decks	= [];

	this.owned	= -1;
}

Perk.fn = Perk.prototype;


// ================================================================
// = 初始化
// ================================================================

Perk.fn.init = function(arg) {
	this.name	= (typeof arg.name  === "string")? arg.name		: "[undefined]";
	this.title	= (typeof arg.title === "string")? arg.title	: "[undefined]";
	this.decks	= (typeof arg.decks !== "undefined")? this.initDecks(arg.decks) : [];

	this.rank	= -1;
	this.equipped = false;
}

Perk.fn.initDecks = function(decks) {
	if ( ! (decks instanceof Array)) return [];
	
	var self = this;

	return decks.map(function(deck) {
		var deckObject = new Deck(self);
		deckObject.init(deck);

		return deckObject;
	});
}


// ================================================================
// = 存取
// ================================================================

Perk.fn.set = function() {
	this.equipped = true;
}

Perk.fn.unset = function() {
	this.equipped = false;
}

Perk.fn.isset = function() {
	return this.equipped;
}

Perk.fn.updateStatus = function() {

	var deckIndex = -1;
	// 找到 deck.owned == true, 並將之前的 deck 的 owned 設為 true
	for (var i = this.decks.length - 1; i >= 0; i--) {
		if (deckIndex < 0) {
			if (this.decks[i].isset() === true) deckIndex = i;
		} else {
			this.decks[i].set();
		}

	}

	this.rank = deckIndex;
}

Perk.fn.clear = function() {
	this.decks.forEach(function(deck) {
		deck.unset();
	});
}


// ================================================================
// = 呼叫上層相關
// ================================================================

Perk.fn.callParentSet = function(targetDeck) {
	this._parentPerks.callParentSet(this);
	
	targetDeck.set();
	this.updateStatus();	
}


// ================================================================
// = 呼叫下層相關
// ================================================================

