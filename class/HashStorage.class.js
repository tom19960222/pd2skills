/**
 * Hash資料存取類別
 */
function HashStorage(location) {
	if ( ! this instanceof HashStorage) return new HashStorage(location);
	Storage.call(this);

	this._location = location;

	this.load();
}

HashStorage.prototype = Object.create(Storage.prototype);
HashStorage.fn = HashStorage.prototype;


// ================================================================
// = Save & Load
// ================================================================

/**
 * 儲存
 */
HashStorage.fn.save = function() {

	var datas = [];

	Object.keys(this._container).forEach(function(header) {

		var data = this.get(header);
		if (data) datas.push(header + data);

	}, this);

	var hash = 'skill/' + datas.join(':');
	this._location.path(hash);
}

/**
 * 載入
 */
HashStorage.fn.load = function() {
	
	this.clear();
	var hash = this._location.path().replace('/skill/', '');

	// 分割字串
	var parts = hash.split(':');
	parts.forEach(function(part) {
		if (part == '') return;
		
		var header = part.charAt(0);
		var data = part.slice(1);

		this.$set(header, data);

	}, this);
}

// ================================================================
// = Set & Get
// ================================================================

HashStorage.fn.$set = HashStorage.fn.set;
HashStorage.fn.set = function(key, value) {
	this.$set(key, value);
	this.save();
}

HashStorage.fn.$get = HashStorage.fn.get;
HashStorage.fn.get = function(key) {
	return this.$get(key);
}