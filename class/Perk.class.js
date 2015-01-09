/**
 * 牌組類別
 */
function Perk(parent) {
	// 防止未經 new 建構類別
	if ( ! this instanceof Perk) return new Perk(parent);

	this._parent = parent;
	this.childList = [];

	this.code	= "[undefined]";
	this.name	= "[undefined]";
	this.title	= "[undefined]";

	this.rank	= -1;
	this.equipped = false;
}

Perk.prototype = Object.create(PerkDecksPrototype.prototype);
Perk.fn = Perk.prototype;


// ================================================================
// = 初始化
// ================================================================

Perk.fn.init = function(arg) {
	this.code	= (typeof arg.code  === "string")? arg.code		: this.code;
	this.name	= (typeof arg.name  === "string")? arg.name		: this.name;
	this.title	= (typeof arg.title === "string")? arg.title	: this.title;
	if (typeof arg.decks !== "undefined") this.addChilds(arg.decks);
}

Perk.fn.initChild = function(arg) {
	var newInstance = new Deck(this);
	newInstance.init(arg);

	return newInstance;
}


// ================================================================
// = Equip
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

// ================================================================
// = Rank
// ================================================================

Perk.fn.setRank = function(rank) {
	this.rank = rank;
	this.updateDeckStatus();
}

Perk.fn.getRank = function() {
	return this.rank;
}

// ================================================================
// = Update
// ================================================================

Perk.fn.updateStatus = function() {

	var deckIndex = -1;
	// 找到 deck.owned == true, 並將之前的 deck 的 owned 設為 true
	for (var i = this.childList.length - 1; i >= 0; i--) {
		if (deckIndex < 0) {
			if (this.childList[i].isset() === true) deckIndex = i;
		} else {
			this.childList[i].set();
		}
	}

	this.rank = deckIndex;
}

Perk.fn.clear = function() {
	this.loopChild(function(deck) {
		deck.unset();
	});
}


// ================================================================
// = 呼叫上層相關
// ================================================================

Perk.fn.callParentSet = function(targetDeck) {
	this._parent.callParentSet(this);
	
	targetDeck.set();
	this.updateStatus();	
}


// ================================================================
// = 呼叫下層相關
// ================================================================

Perk.fn.updateDeckStatus = function() {

	var deckIndex = this.rank;
	for (var i = 0; i < this.childList.length; i++) {
		if (i > deckIndex) {
			this.childList[i].unset();
		} else {
			this.childList[i].set();
		}
	}
}