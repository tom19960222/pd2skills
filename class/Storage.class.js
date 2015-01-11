/**
 * Storage
 */
function Storage() {
	if ( ! this instanceof Storage) return new Storage(parent);

	this._container = {};
}

Storage.fn = Storage.prototype;


// ================================================================
// = Methods
// ================================================================

Storage.fn.set = function(key, value) {
	this._container[key] = value;
}

Storage.fn.get = function(key) {
	return this._container[key];
}

Storage.fn.clear = function() {
	this._container = {};
}

Storage.fn.count = function() {
	return Object.keys(this._container).length;
}

Storage.fn.isset = function(key) {
	return (typeof this._container[key] === "undefined");
}

Storage.fn.unset = function(key) {
	return delete this._container[key];
}