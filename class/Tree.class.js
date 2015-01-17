/**
 * 技能樹類別
 */
function Tree(parent, arg) {
	// 防止未經 new 建構類別
	if ( ! this instanceof Tree) return new Tree(parent, arg);
	SkillTreePrototype.call(this, parent);

	this.name	= "";
	this.title	= "";
	this.text	= "";

	this.spendPoint	= 0;
	this.spendCost = 0;

	this.infamy = false;

	this.init(arg);
}

Tree.prototype = Object.create(SkillTreePrototype.prototype);
Tree.fn = Tree.prototype;


// ================================================================
// = 初始化
// ================================================================

Tree.fn.init = function(arg) {
	if ( ! arg) return;

	this.name	= (typeof arg.name	=== "string")? arg.name : this.name;
	this.title	= (typeof arg.title	=== "string")? arg.title : this.title;
	this.text	= (typeof arg.text	=== "string")? arg.text : this.text;

	if (typeof arg.tiers !== "undefined") this.addChilds(arg.tiers);
}


Tree.fn.initChild = function(arg) {
	return new Tier(this, arg);
}


// ================================================================
// = 設定
// ================================================================

/**
 * 設定惡名
 */
Tree.fn.setInfamy = function(bool) {
	if (typeof bool !== "boolean") return;
	if (this.infamy === bool) return;

	this.infamy = bool;
	this.updateTierRequire();
	this.callParentUpdate();
}

/**
 * 重設技能樹
 */
Tree.fn.unset = function(tree) {
	this.getChild(0).getChild(0).unset();
}


// ================================================================
// = 更新
// ================================================================

/**
 * 更新階層並計算使用點數
 */
Tree.fn.updateStatus = function() {
	this.updateSpendPoint();
}


// ================================================================
// = 計算點數與費用
// ================================================================

/**
 * 更新花費技能點數
 */
Tree.fn.updateSpendPoint = function() {
	var spendPoint = 0;
	this.loopChild(function(child) {
		spendPoint += child.updateStatus(spendPoint);
	});

	this.spendPoint = spendPoint;
}

/**
 * 更新花費費用
 */
Tree.fn.updateSpendCost = function() {
	this.spendCost = this.$getSpendCost();
}

/**
 * 取得花費技能點數
 */
Tree.fn.getSpendPoint = function(bool) {
	if (bool === true) this.updateSpendPoint();
	return this.spendPoint;
}

/**
 * 取得花費費用
 */
Tree.fn.$getSpendCost = Tree.fn.getSpendCost;
Tree.fn.getSpendCost = function(bool) {
	if (bool === true) this.updateSpendCost();
	return this.spendCost;
}


// ================================================================
// = 請求 > 屬性
// ================================================================

/**
 * 請求階層解鎖需求
 */
Tree.fn.requestTierRequire = function(tier, reduce) {
	return this._parent.requestTierRequire(tier, this.infamy);
}


// ================================================================
// = 呼叫 > 更新狀態
// ================================================================

/**
 * 向上呼叫 更新
 */
Tree.fn.callParentUpdate = function() {
	this._parent.callParentUpdate(this);
}


// ================================================================
// = Storage
// ================================================================

Tree.fn.save = function(storage) {

	var datas = [];

	var timer = 0;
	this.loopChild(function(tier) {
		
		tier.loopChild(function(skill) {
			
			if (skill.ownBasic) {
				var code = timer + 97;
				if (skill.ownAce) code -= 32;
				
				datas.push(String.fromCharCode(code));
			}
			
			++timer;
		});
	}); // end forEach tiers
	
	// 儲存
	var header = this.name.charAt(0).toLowerCase();
	var string = datas.join('');

	storage.set(header, string);
}

Tree.fn.load = function(storage) {

	var header = this.name.charAt(0).toLowerCase();
	if ( ! storage.isset(header)) return;
	
	var string = storage.get(header);
	var datas = string.split('');

	// 字元轉Ascii碼
	datas = datas.map(function(code) {
		return code.charCodeAt(0);
	});
	
	var timer = 0;
	this.loopChild(function(tier) {
		
		tier.loopChild(function(skill) {
			
			var codeAce = timer + 65;
			var codeBasic = codeAce + 32;
			
			if (datas.indexOf(codeAce) >= 0) {
				// 擁有 Ace
				skill.ownAce   = true;
				skill.ownBasic = true;
			} else if (datas.indexOf(codeBasic) >= 0) {
				// 擁有 Basic
				skill.ownBasic = true;
			}
			
			// 計數器加一
			timer++;
		});
		
	});
}