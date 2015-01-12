/**
 * Infamy Prototype
 */
function InfamyPrototype() {
	if ( ! this instanceof InfamyPrototype) return new InfamyPrototype;
	Composite.call(this);
}

InfamyPrototype.prototype = Object.create(Composite.prototype);
InfamyPrototype.fn = InfamyPrototype.prototype;


// ================================================================
// = Methods
// ================================================================

InfamyPrototype.fn.callParentUpdate = function() {}

InfamyPrototype.fn.callChildsUpdateUsedPoint = function() {}

InfamyPrototype.fn.callChildsUpdateStatus = function() {}