/**
 * Infamy
 */
function Infamy(parent) {
	if ( ! this instanceof Infamy) return new Infamy(parent);

	this._parent = parent;

	this.name	= "";
	this.title	= "";
	this.text	= "";
	this.bonuses = [];

	this.owned	= false;
	this.unlock = false;
}

Infamy.prototype = Object.create(InfamyPrototype.prototype);
Infamy.fn = Infamy.prototype;


// ================================================================
// = Init
// ================================================================

Infamy.fn.init = function(args) {
	this.name	= (typeof args.name  === "string")? args.name	: this.name;
	this.title	= (typeof args.title === "string")? args.title	: this.title;
	this.text	= (typeof args.text  === "string")? args.text	: this.text;
	this.bonuses = (args.bonuses instanceof Array)? args.bonuses : this.bonuses;
}


Infamy.fn.set = function(status) {
	if (typeof status !== "boolean") return;
	if (this.owned === status) return;

	if (status === true && this.unlock !== true) return;

	this.owned = status;
	this.callParentUpdate();
}


// ================================================================
// = Update
// ================================================================

/**
 * 更新狀態
 */
Infamy.fn.updateStatus = function(availablePoint) {
	this.updateUnlockStatus(availablePoint);
	this.updateOwnStatus();
}

/**
 * 更新解鎖狀態
 */
Infamy.fn.updateUnlockStatus = function(availablePoint) {
	// 判斷階層是否解鎖
	if (this._parent.unlockStatus === true) {
		this.unlock = (availablePoint >= 1 || this.owned);
	} else {
		this.unlock = false;
	}
}

/**
 * 更新擁有狀態
 */
Infamy.fn.updateOwnStatus = function() {
	if (this.unlock !== true) this.owned = false;
}


// ================================================================
// = Methods
// ================================================================

Infamy.fn.callParentUpdate = function() {
	return this._parent.callParentUpdate();
}

Infamy.fn.callChildsUpdateStatus = function(availablePoint) {
	this.updateStatus(availablePoint);
}