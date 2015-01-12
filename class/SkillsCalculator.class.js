/**
 * 計算機類別
 */
function SkillsCalculator(arg) {
	// 防止未經 new 建構類別
	if ( ! this instanceof SkillsCalculator) return new SkillsCalculator(arg);

	this.childList = [];
	this.pointerList = {};

	this.totalPoint	= 120;
	this.usedPoint	= 0;

	this.init(arg);
}

SkillsCalculator.prototype = Object.create(SkillTreePrototype.prototype);
SkillsCalculator.fn = SkillsCalculator.prototype;


// ================================================================
// = 初始化
// ================================================================

/**
 * 初始化
 */
SkillsCalculator.fn.init = function(arg) {
	if (typeof arg === "undefined") return;

	this.addChilds(arg);
	this.bulidPointerList();

	this.updateStatus(true);
}

/**
 * 初始化 Child
 */
SkillsCalculator.fn.initChild = function(arg) {
	var newInstance = new Tree(this);
	newInstance.init(arg);

	return newInstance;
}


// ================================================================
// = 更新狀態相關
// ================================================================

/**
 * 更新所有技能樹與技能
 */
SkillsCalculator.fn.updateStatus = function(renew) {
	// 判斷是否刷新
	if (renew === true) {
		// 更新所有技能樹
		this.callChildsUpdateTree();
	}
	
	// 更新已使用技能點
	this.getUsedPoint(true);

	// 更新技能狀態
	this.callChildUpdateSkill(this.getAvailablePoint());
}

/**
 * 取得已使用技能點
 */
SkillsCalculator.fn.getUsedPoint = function(renew) {

	// 判斷是否刷新
	if (renew === true) {
		var countUsedPoint = 0;

		this.loopChild(function(tree) {
			countUsedPoint += tree.usedPoint;
		});

		this.usedPoint = countUsedPoint;	
	}

	return this.usedPoint;
}

/**
 * 取得可用技能點
 */
SkillsCalculator.fn.getAvailablePoint = function() {
	return this.totalPoint - this.usedPoint;
}

/**
 * 重設技能
 */
SkillsCalculator.fn.unset = function() {
	this.loopChild(function(tree) {
		tree.unset();
	});
}


// ================================================================
// = Infamy
// ================================================================

/**
 * 設定惡名
 */
SkillsCalculator.fn.setInfamy = function(infamyStatus) {
	this.loopChild(function(tree, index) {
		tree.setInfamy(infamyStatus[index] || false);
	});
}


// ================================================================
// = Pointer
// ================================================================

/**
 * 設定技能指標
 */
SkillsCalculator.fn.initPointer = function (pointerName) {
	// 初始化指標
	if (typeof this.pointerList[pointerName] === "undefined") {
		this.pointerList[pointerName] = new Pointer;
	}

	return this.pointerList[pointerName];
}

/**
 * 新增至技能指標清單
 */
SkillsCalculator.fn.setPointer = function(pointerName, skill) {
	if (typeof this.pointerList[pointerName] === "undefined")
		throw "未定義指標: " + pointerName;

	this.pointerList[pointerName].setTarget(skill);
}

/**
 * 建立技能指標清單
 */
SkillsCalculator.fn.bulidPointerList = function() {

	var skillNameList = [];
	for (var skillName in this.pointerList) {
		skillNameList.push(skillName);
	}
	
	this.callChildsbulidPointerList(skillNameList);
}


// ================================================================
// = Storage
// ================================================================

SkillsCalculator.fn.setStorage = function(storage) {
	this._storage = storage;
}

SkillsCalculator.fn.save = function(storage) {
	this.loopChild(function(child) {
		child.save(storage);
	});
}

SkillsCalculator.fn.load = function(storage) {
	this.loopChild(function(child) {
		child.load(storage);
	});

	this.updateStatus();
}


// ================================================================
// = 責任鍊 > 更新狀態
// ================================================================

/**
 * 向上呼叫 更新
 */
SkillsCalculator.fn.callParentUpdate = function() {
	this.updateStatus();
}

/**
 * 向下呼叫 更新技能樹
 */
SkillsCalculator.fn.callChildsUpdateTree = function () {
	this.loopChild(function(child) {
		child.callChildsUpdateTree();
	});
}

// ================================================================
// = 責任鍊 > 指標
// ================================================================

/**
 * 向上呼叫 初始指標
 */
SkillsCalculator.fn.callParentInitPointer = function(pointerName) {
	return this.initPointer(pointerName);
}

/**
 * 向上呼叫 設定指標
 */
SkillsCalculator.fn.callParentSetPointer = function(pointerName, skill) {
	this.setPointer(pointerName, skill);
}
