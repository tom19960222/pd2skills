/**
 * 技能類別
 */
function Skill(parent) {
	// 防止未經 new 建構類別
	if ( ! this instanceof Skill) return new Skill(parentTier);

	this._parent = parent;

	this.name	= "[undefined]";
	this.title	= "[undefined]";
	this.basic	= "[undefined]";
	this.ace	= "[undefined]";
	this.text	= "";
	
	this.ownBasic	= false;
	this.ownAce		= false;
	
	this.unlockBasic	= false;
	this.unlockAce		= false;

	this.require		= false;
	this.unlockRequire	= false;
	
	this.alert	= false;
}

Skill.prototype = Object.create(SkillTreePrototype.prototype);
Skill.fn = Skill.prototype;


// ================================================================
// = 初始化
// ================================================================

Skill.fn.init = function(arg) {
	this.name		= (typeof arg.name  === "string")? arg.name		: this.name;
	this.title		= (typeof arg.title === "string")? arg.title	: this.title;
	this.basic		= (typeof arg.basic === "string")? arg.basic	: this.basic;
	this.ace		= (typeof arg.ace   === "string")? arg.ace		: this.ace;
	this.text		= (typeof arg.text  === "string")? arg.text		: this.text;

	if (typeof arg.require !== "undefined") this.initRequire(arg.require);
}

Skill.fn.initRequire = function(requireSkillName) {
	if (typeof requireSkillName !== "string") return;

	this.require = this.callParentInitPointer(requireSkillName);
}


// ================================================================
// = 更新狀態相關
// ================================================================

/**
 * 更新技能狀態
 */
Skill.fn.updateStatus = function(leftPoint) {
	var needParentUpdate = this.updateRequireStatus();
	this.updateUnlockStatus(leftPoint);
	this.updateOwnStatus();

	if (needParentUpdate) this.callParentUpdate();
}

/**
 * 更新技能前置解鎖狀態
 */
Skill.fn.updateRequireStatus = function() {
	
	if ( ! (this.require instanceof Pointer)) {
		this.unlockRequire = true;
		return false;
	}

	var pointer = this.require.getTarget();
	if ( ! (pointer instanceof Skill)) throw "目標為空";

	// 判斷前置技能是否解鎖
	var newStatus = (pointer.ownBasic === true);
	var isNeedUpdate = false;
	
	if ( ! newStatus) {
		this.unlockBasic	= false;
		this.unlockAce		= false;	
		
		// 若狀態由 true 轉為 false, 則需要更新此技能樹
		if (this.unlockRequire == true) isNeedUpdate = true;
	}

	this.unlockRequire = newStatus;
	return isNeedUpdate;
}

/**
 * 更新技能解鎖狀態
 */
Skill.fn.updateUnlockStatus = function(leftPoint) {
	
	// 若前置未解鎖則回傳
	if (this.unlockRequire === false) return;

	// 判斷階層是否解鎖
	if (this._parent.unlockStatus === true) {
		this.unlockBasic = (leftPoint >= this._parent.skillUnlockPointBasic || this.ownBasic);
		this.unlockAce   = (this._parent.skillUnlockPointAce > 0)
			? (this.ownBasic)
				? (leftPoint >= this._parent.skillUnlockPointAce || this.ownAce)
				: (leftPoint >= this._parent.skillUnlockPointBasic + this._parent.skillUnlockPointAce)
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
// = 責任鍊 > 更新狀態
// ================================================================

/**
 * 向下呼叫 更新技能
 */
Skill.fn.callChildUpdateSkill = function (availablePoint) {
	this.updateStatus(availablePoint);
}


// ================================================================
// = 責任鍊 > 指標
// ================================================================

/**
 * 向下呼叫 建立指標清單
 */
Skill.fn.callChildsbulidPointerList = function(skillNameList) {
	var skillName = this.name;

	// 若在清單內, 則向上傳遞設定指標清單
	if (skillNameList.indexOf(skillName) >= 0) {
		this.callParentSetPointer(skillName, this);
	};
}