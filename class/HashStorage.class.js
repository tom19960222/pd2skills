/**
 * Hash資料存取類別
 */
function HashStorage(location) {
	if ( ! this instanceof HashStorage) return new HashStorage(location);
	Storage.call(this);

	this.location = location;

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

	Object.keys(this._container).forEach(function(key) {

		var data = this.get(key);

		if ( ! (data instanceof Array)) return;
		if (data.length <= 0) return;

		datas.push(data);	

	}, this);

	var hash = 'skill/' + datas.join(':');
	this.location.path(hash);
}

/**
 * 載入
 */
HashStorage.fn.load = function() {
	
	this.clear();

	var hash = this.location.path().replace('/skill/', '');

	// 分割字串
	var parts = hash.split(':');
	
	// 分析字串
	parts.forEach(function(part) {
		if (part == '') return;
		
		// 分割字元
		data = part.match(/([a-zA-Z]\d*)/g);

		// 取標頭
		var header = data.shift();

		this.set(header, data);
	});
}