/**
 * Infamy
 */
function InfamyPrototype(parent) {
	throw "此為抽象類別";
}

InfamyPrototype.prototype = Object.create(Composite.prototype);
InfamyPrototype.fn = InfamyPrototype.prototype;


// ================================================================
// = Methods
// ================================================================

InfamyPrototype.fn.callParentUpdate = function() {}

InfamyPrototype.fn.callChildsUpdateUsedPoint = function() {}

InfamyPrototype.fn.callChildsUpdateStatus = function() {}