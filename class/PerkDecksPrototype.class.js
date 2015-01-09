/**
 * PerkDecks
 */
function PerkDecksPrototype(parent) {
	throw "此為抽象類別";
}

PerkDecksPrototype.prototype = Object.create(Composite.prototype);
PerkDecksPrototype.fn = PerkDecksPrototype.prototype;


// ================================================================
// = Methods
// ================================================================

PerkDecksPrototype.fn.callParentSet = function(arg) {
	this._parent.callParentSet(arg);
}