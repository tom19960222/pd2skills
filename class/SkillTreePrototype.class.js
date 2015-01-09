/**
 * Infamy
 */
function SkillTreePrototype(parent) {
	throw Exception("此為抽象類別");
}

SkillTreePrototype.prototype = Object.create(Composite.prototype);
SkillTreePrototype.fn = SkillTreePrototype.prototype;


// ================================================================
// = 責任鍊 > 更新狀態
// ================================================================

/**
 * 向上呼叫 更新
 */
SkillTreePrototype.fn.callParentUpdate = function() {
	this._parent.callParentUpdate();
}


/**
 * 向下呼叫 更新技能樹
 */
SkillTreePrototype.fn.callChildsUpdateTree = function () {
}

/**
 * 向下呼叫 更新技能
 */
SkillTreePrototype.fn.callChildUpdateSkill = function (availablePoint) {
	this.loopChild(function(child) {
		child.callChildUpdateSkill(availablePoint);
	});
}


// ================================================================
// = 責任鍊 > 指標
// ================================================================

/**
 * 向上呼叫 初始指標
 */
SkillTreePrototype.fn.callParentInitPointer = function(pointerName) {
	return this._parent.callParentInitPointer(pointerName);
}

/**
 * 向上呼叫 設定指標
 */
SkillTreePrototype.fn.callParentSetPointer = function(pointerName, skill) {
	this._parent.callParentSetPointer(pointerName, skill)
}

/**
 * 向下呼叫 建立指標清單
 */
SkillTreePrototype.fn.callChildsbulidPointerList = function(nameList) {
	this.loopChild(function(child) {
		child.callChildsbulidPointerList(nameList);
	});
}