/**
 * 額外牌組
 */
function PerkDecksCalculator(arg) {
	// 防止未經 new 建構類別
	if ( ! this instanceof PerkDecksCalculator) return new PerkDecksCalculator(arg);

	this.childList = [];

	this.init(arg);
	this.equipped = -1;
}

PerkDecksCalculator.prototype = Object.create(PerkDecksPrototype.prototype);
PerkDecksCalculator.fn = PerkDecksCalculator.prototype;


// ================================================================
// = 初始化
// ================================================================

PerkDecksCalculator.fn.init = function(arg) {
	if (typeof arg === "undefined") return;

	this.addChilds(arg);
}

PerkDecksCalculator.fn.initChild = function(arg) {
	var newInstance = new Perk(this);
	newInstance.init(arg);

	return newInstance;
}


// ================================================================
// = 存取
// ================================================================

PerkDecksCalculator.fn.updateStatus = function() {
	this.loopChild(function(perk, index) {
		if (perk.isset()) this.equipped = index;
	}, this);
}

PerkDecksCalculator.fn.getEquippedPerk = function() {
	if (this.equipped == -1) return null;
	if (typeof this.childList[this.equipped] === "undefined") return null;
	
	return this.childList[this.equipped];
}

PerkDecksCalculator.fn.clear = function() {
	this.loopChild(function(perk) {
		perk.clear();
		perk.unset();
	});
}


// ================================================================
// = Storage
// ================================================================

PerkDecksCalculator.fn.save = function(storage) {
	
	var header = 'p';
	var string = '';

	var perk = this.getEquippedPerk();

	if (perk) {
		var perkCode = perk.code.toUpperCase();
		var perkRank = perk.getRank();

		string = perkCode + perkRank;
	}

	storage.set(header, string);
}

PerkDecksCalculator.fn.load = function(storage) {

	var header = 'p';
	if (storage.isset(header)) {

		var string = storage.get(header);
		var datas = string.match(/([a-zA-Z]\d*)/g);

		var dataIndexList = {};
		datas.forEach(function(data) {
			var code = data.charAt(0);
			var value = data.slice(1);

			dataIndexList[code] = value;
		});

		this.loopChild(function(perk) {
			var perkCode = perk.code.toUpperCase();
			if (typeof dataIndexList[perkCode] === "undefined") return;

			var data = dataIndexList[perkCode];

			perk.set();
			perk.setRank(data);
		});
	}

	this.updateStatus();
}

// ================================================================
// = 呼叫上層相關
// ================================================================

PerkDecksCalculator.fn.callParentSet = function(targetPerk) {
	this.clear();

	targetPerk.set();
	this.updateStatus();
}


// ================================================================
// = 呼叫下層相關
// ================================================================

