/**
 * Infamy
 */
function InfamyCalculator(arg) {
	// 防止未經 new 建構類別
	if ( ! this instanceof InfamyCalculator) return new InfamyCalculator(arg);
	InfamyPrototype.call(this);
	
	this._skillsCalculator = null;

	this.totalPoint	= 5;
	this.usedPoint	= 0;

	this.init(arg);
}

InfamyCalculator.prototype = Object.create(InfamyPrototype.prototype);
InfamyCalculator.fn = InfamyCalculator.prototype;


// ================================================================
// = Init
// ================================================================

InfamyCalculator.fn.init = function(arg) {
	if (typeof arg === "undefined") return;

	if (typeof arg.tiers !== "undefined") this.addChilds(arg.tiers);
}

InfamyCalculator.fn.initChild = function(arg) {
	var newInstance = new InfamyTier(this);
	newInstance.init(arg);

	return newInstance;
}


// ================================================================
// = Update
// ================================================================

InfamyCalculator.fn.updateStatus = function() {
	// 更新階層狀態
	this.usedPoint = this.callChildsUpdateUsedPoint();
	// 更新技能狀態
	this.callChildsUpdateStatus(this.getAvailablePoint());
	// 更新技能計算機
	this.updateSkillsCalculator();
}

/**
 * 取得可用技能點
 */
InfamyCalculator.fn.getAvailablePoint = function() {
	return this.totalPoint - this.usedPoint;
}


// ================================================================
// = SkillsCalculator
// ================================================================

InfamyCalculator.fn.setSkillsCalculator = function(skillsCalculator) {
	if ( ! (skillsCalculator instanceof SkillsCalculator)) return;
	this._skillsCalculator = skillsCalculator;
}

InfamyCalculator.fn.updateSkillsCalculator = function() {
	if ( ! this._skillsCalculator) return;

	var infamyStatus = this.getInfamyStatus();
	this._skillsCalculator.setInfamy(infamyStatus);
	this._skillsCalculator.costReduce(this.isCostReduce());
}

InfamyCalculator.fn.getInfamyStatus = function() {
	
	var tier1 = this.getChild(1);
	var infamyStatus = tier1.loopChild(function(child) {
		return child.owned;
	});

	var no5 = false;
	infamyStatus.forEach(function(status) {
		no5 = (no5 || status);
	});

	infamyStatus.push(no5);

	return infamyStatus;
}

InfamyCalculator.fn.isCostReduce = function() {
	return this.getChild(0).getChild(0).owned;
}

// ================================================================
// = Storage
// ================================================================

InfamyCalculator.fn.save = function(storage) {

	var datas = [];
	
	var timer = 0;
	this.loopChild(function(tier) {

		tier.loopChild(function(infamy) {

			if (infamy.owned === true) {
				var code = timer + 97;
				datas.push(String.fromCharCode(code));
			}

			++timer;
		});
	});
	
	// 儲存
	var header = 'i';
	var string = datas.join('');

	storage.set(header, string);
}

InfamyCalculator.fn.load = function(storage) {

	var header = 'i';
	if (storage.isset(header)) {
	
		var string = storage.get(header);
		var datas = string.split('');

		// 字元轉Ascii碼
		datas = datas.map(function(code) {
			return code.charCodeAt(0);
		});
		
		var timer = 0;
		this.loopChild(function(tier) {

			tier.loopChild(function(infamy) {

				var code = timer + 97;
				if (datas.indexOf(code) >= 0) infamy.owned = true;

				++timer;
			});
		});
	}

	this.updateStatus();
}


// ================================================================
// = Call
// ================================================================

InfamyCalculator.fn.callParentUpdate = function(calledByTier) {
	this.updateStatus();
}

InfamyCalculator.fn.callChildsUpdateUsedPoint = function() {
	var countUsedPoint = 0;

	this.loopChild(function(child) {
		countUsedPoint = child.updateStatus(countUsedPoint);
	});

	return countUsedPoint;
}

InfamyCalculator.fn.callChildsUpdateStatus = function(availablePoint) {
	this.loopChild(function(child) {
		child.callChildsUpdateStatus(availablePoint);
	});
}