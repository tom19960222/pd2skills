/**
 * 技能類別
 */
function Skill(parentTier) {
	// 防止未經 new 建構類別
	if ( ! this instanceof Skill) return new Skill(parentTier);

	this._parentTier = parentTier;

	this.name	= "";
	this.title	= "";
	this.basic	= "";
	this.ace	= "";
	this.text	= "";
	
	this.ownBasic	= false;
	this.ownAce		= false;
	
	this.unlockBasic	= false;
	this.unlockAce		= false;

	this.require		= false;
	this.unlockRequire	= false;
	
	this.alert	= false;

	
}

Skill.fn = Skill.prototype;


// ================================================================
// = 初始化
// ================================================================

Skill.fn.init = function(arg) {
	this.name		= (typeof arg.name  === "string")? arg.name		: "[undefined]";
	this.title		= (typeof arg.title === "string")? arg.title	: "[undefined]";
	this.basic		= (typeof arg.basic === "string")? arg.basic	: "[undefined]";
	this.ace		= (typeof arg.ace   === "string")? arg.ace		: "[undefined]";
	this.text		= (typeof arg.text  === "string")? arg.text		: "";
	this.require	= (typeof arg.require !== "undefined")
		? this.initRequire(arg.require)
		: false;
}

Skill.fn.initRequire = function(requireSkillName) {
	if (typeof requireSkillName !== "string") return false;

	return this.callParentSetPointer(requireSkillName);
}


// ================================================================
// = 更新狀態相關
// ================================================================

/**
 * 更新技能狀態
 */
Skill.fn.updateStatus = function(leftPoint) {
	this.updateUnlockStatus(leftPoint);
	this.updateOwnStatus();
}

/**
 * 更新技能解鎖狀態
 */
Skill.fn.updateUnlockStatus = function(leftPoint) {
	
	// 判斷前置技能是否解鎖
	if (this.require !== false) {
		this.unlockRequire = (this.require.skill.ownBasic === true);
	} else {
		this.unlockRequire = true;
	}
	
	// 判斷階層是否解鎖
	if (this._parentTier.unlockStatus === true && this.unlockRequire === true) {
		this.unlockBasic = (leftPoint >= this._parentTier.skillUnlockPointBasic || this.ownBasic);
		this.unlockAce   = (this._parentTier.skillUnlockPointAce > 0)
			? (this.ownBasic)
				? (leftPoint >= this._parentTier.skillUnlockPointAce || this.ownAce)
				: (leftPoint >= this._parentTier.skillUnlockPointBasic + this._parentTier.skillUnlockPointAce)
			: false;
	} else {
		this.unlockBasic = false;
		this.unlockAce   = false;
	}
}

/**
 * 更新技能擁有狀態
 */
Skill.fn.updateOwnStatus = function() {
	if (this.unlockBasic !== true) this.ownBasic = false;
	if (this.unlockAce   !== true) this.ownAce   = false;
}


// ================================================================
// = 解鎖重設技能
// ================================================================

/**
 * 解鎖技能
 */
Skill.fn.unlock = function() {
	
	if (this.ownBasic !== true) {
		
		if (this.unlockBasic) this.ownBasic = true;
		
	} else if (this.ownAce !== true) {
		
		if (this.unlockAce) this.ownAce = true;
		
	}
	
	this.callParentUpdate();
}

/**
 * 重設技能
 */
Skill.fn.unset = function() {
	this.ownBasic = false;
	this.ownAce   = false;

	this.callParentUpdate();
}


// ================================================================
// = 呼叫上層相關
// ================================================================

/**
 * 呼叫上層更新
 */
Skill.fn.callParentUpdate = function() {
	this._parentTier.callParentUpdate();
}

/**
 * 向上呼叫設定技能指標
 */
Skill.fn.callParentSetPointer = function(pointerName) {
	return this._parentTier.callParentSetPointer(pointerName);
}

/**
 * 向上呼叫設定技能指標清單
 */
Skill.fn.callParentSetPointerList = function(pointerName, skill) {
	this._parentTier.callParentSetPointerList(pointerName, skill);
}


// ================================================================
// = 呼叫下層相關
// ================================================================

/**
 * 更新技能狀態
 */
Skill.fn.updateSkillStatus = function(leftPoint) {
	this.updateStatus(leftPoint);
}

/**
 * 向下呼叫建立指標清單
 */
Skill.fn.bulidPointerList = function(skillNameList) {
	var skillName = this.name;

	// 若在清單內, 則向上傳遞設定指標清單
	if (skillNameList.indexOf(skillName) >= 0) {
		this.callParentSetPointerList(skillName, this);
	};
}