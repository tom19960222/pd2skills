/**
 * 技能類別
 */
function Skill(parent, arg) {
	// 防止未經 new 建構類別
	if ( ! this instanceof Skill) return new Skill(parent, arg);

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

	this.init(arg);
}

Skill.prototype = Object.create(SkillTreePrototype.prototype);
Skill.fn = Skill.prototype;


// ================================================================
// = 初始化
// ================================================================

Skill.fn.init = function(arg) {
	if ( ! arg) return;
	
	this.name		= (typeof arg.name  === "string")? arg.name		: this.name;
	this.title		= (typeof arg.title === "string")? arg.title	: this.title;
	this.basic		= (typeof arg.basic === "string")? arg.basic	: this.basic;
	this.ace		= (typeof arg.ace   === "string")? arg.ace		: this.ace;
	this.text		= (typeof arg.text  !== "undefined")? arg.text		: this.text;

	if (typeof arg.require !== "undefined") this.initRequire(arg.require);
}

Skill.fn.initRequire = function(requireSkillName) {
	if (typeof requireSkillName !== "string") return;

	this.require = this.callParentInitPointer(requireSkillName);
}


// ================================================================
// = 設定
// ================================================================

Skill.fn.set = function(key, value) {
	switch (String(key).toLowerCase()) {
		case "basic" :
			return this.ownBasic = Boolean(value);
		case "ace" :
			return this.ownAce = Boolean(value);
		default :
			throw "Undefined key : " + key;
	}
}

Skill.fn.isOwned = function(key) {
	switch (String(key).toLowerCase()) {
		case "basic" :
			return this.ownBasic;
		case "ace" :
			return this.ownAce;
		default :
			throw "Undefined key : " + key;
	}
}

Skill.fn.isUnlocked = function(key) {
	switch (String(key).toLowerCase()) {
		case "basic" :
			return this.unlockBasic;
		case "ace" :
			return this.unlockAce;
		default :
			throw "Undefined key : " + key;
	}
}

// ================================================================
// = 更新狀態相關
// ================================================================

/**
 * 更新技能狀態
 */
Skill.fn.updateStatus = function(availablePoint) {
	var needParentUpdate = this.updateRequireStatus();
	this.updateUnlockStatus(availablePoint);
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
	var newStatus = (pointer.isOwned("basic"));
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
Skill.fn.updateUnlockStatus = function(availablePoint) {
	
	// 若前置未解鎖則回傳
	if (this.unlockRequire === false) return;

	// 判斷階層是否解鎖
	if ( ! this._parent.isUnlocked()) {
		this.unlockBasic	= false;
		this.unlockAce		= false;

		return;
	}
	
	this.unlockBasic = (availablePoint >= this._parent.skillPointBasic || this.isOwned("basic"));
	this.unlockAce   = (this._parent.skillPointAce > 0)
		? (this.isOwned("basic"))
			? (availablePoint >= this._parent.skillPointAce || this.ownAce)
			: (availablePoint >= this._parent.skillPointBasic + this._parent.skillPointAce)
		: false;
}

/**
 * 更新技能擁有狀態
 */
Skill.fn.updateOwnStatus = function() {
	if (this.unlockBasic !== true) this.set("basic", false);
	if (this.unlockAce   !== true) this.set("ace", false);
}


// ================================================================
// = 取得
// ================================================================

/**
 * 取得花費技能點
 */
Skill.fn.getSpendPoint = function() {
	var count = 0;
	if (this.isOwned("basic")) count += this.requestTierSkillPoint("basic");
	if (this.isOwned("ace")) count += this.requestTierSkillPoint("ace");

	return count;
}

/**
 * 取得花費費用
 */
Skill.fn.getSpendCost = function() {
	var count = 0;
	if (this.isOwned("basic")) count += this.requestTierSkillCost("basic");
	if (this.isOwned("ace")) count += this.requestTierSkillCost("ace");

	return count;
}

// ================================================================
// = 事件
// ================================================================

/**
 * 解鎖技能
 */
Skill.fn.unlock = function() {
	
	if ( ! this.isOwned("basic")) {
		
		if (this.isUnlocked("basic")) this.set("basic", true);
		
	} else if ( ! this.isOwned("ace")) {
		
		if (this.isUnlocked("ace")) this.set("ace", true);
		
	}
	
	this.callParentUpdate();
}

/**
 * 重設技能
 */
Skill.fn.unset = function() {
	this.set("basic", false);
	this.set("ace", false);

	this.callParentUpdate();
}



// ================================================================
// = 呼叫 > 更新狀態
// ================================================================

/**
 * 向下呼叫 更新技能
 */
Skill.fn.callChildUpdateSkill = function (availablePoint) {
	this.updateStatus(availablePoint);
}


// ================================================================
// = 呼叫 > 指標
// ================================================================

/**
 * 向下呼叫 建立指標清單
 */
Skill.fn.callChildBulidPointerList = function(skillNameList) {
	var skillName = this.name;

	// 若在清單內, 則向上傳遞設定指標清單
	if (skillNameList.indexOf(skillName) >= 0) {
		this.callParentSetPointer(skillName, this);
	};
}