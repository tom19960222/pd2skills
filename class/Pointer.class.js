/**
 * Pointer
 */
function Pointer() {
	// 防止未經 new 建構類別
	if ( ! this instanceof Pointer) return new Pointer();

	this.target = null;
}

Pointer.fn = Pointer.prototype;

// ================================================================
// = Methods
// ================================================================


Pointer.fn.setTarget = function(target) {
	this.target = target;
}

Pointer.fn.getTarget = function() {
	return this.target;
}