/**
 * 技能樹類別
 */
function Tree(parent) {
	// 防止未經 new 建構類別
	if ( ! this instanceof Tree) return new Tree(parent);
	SkillTreePrototype.call(this);
	
	this._parent = parent;

	this.name	= "";
	this.title	= "";
	this.text	= "";

	this.usedPoint	= 0;
	this.cost = 0;

	this.infamy = false;
}

Tree.prototype = Object.create(SkillTreePrototype.prototype);
Tree.fn = Tree.prototype;


// ================================================================
// = 初始化
// ================================================================

Tree.fn.init = function(arg) {
	this.name	= (typeof arg.name	=== "string")? arg.name : this.name;
	this.title	= (typeof arg.title	=== "string")? arg.title : this.title;
	this.text	= (typeof arg.text	=== "string")? arg.text : this.text;

	if (typeof arg.tiers !== "undefined") this.addChilds(arg.tiers);
}


Tree.fn.initChild = function(arg) {
	var newInstance = new Tier(this);
	newInstance.init(arg);

	return newInstance;
}


// ================================================================
// = 更新狀態相關
// ================================================================

/**
 * 更新階層並計算使用點數
 */
Tree.fn.updateStatus = function() {
	this.callParentUpdate();
}

/**
 * 重設技能樹
 */
Tree.fn.unset = function(tree) {
	this.getChild(0).getChild(0).unset();
}


// ================================================================
// = Infamy
// ================================================================

/**
 * 設定惡名
 */
Tree.fn.setInfamy = function(bool) {
	if (typeof bool !== "boolean") return;
	if (this.infamy === bool) return;

	this.infamy = bool;
	this.callParentUpdate();
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


// ================================================================
// = 責任鍊 > 更新狀態
// ================================================================

/**
 * 向上呼叫 更新
 */
Tree.fn.callParentUpdate = function() {
	// 更新樹
	this.callChildsUpdateTree();
	this.callChildsUpdateCost();
	
	// 更新技能
	this._parent.callParentUpdate();
}

/**
 * 向下呼叫 更新技能樹
 */
Tree.fn.callChildsUpdateTree = function () {
	var usedPoint = 0;
	this.loopChild(function(child) {
		usedPoint += child.callChildsUpdateTree(usedPoint);
	});

	return this.usedPoint = usedPoint;
}

/**
 * 向下呼叫 更新花費
 */
Tree.fn.callChildsUpdateCost = function () {
	var cost = 0;
	this.loopChild(function(child) {
		cost += child.callChildsUpdateCost();
	});

	return this.cost = cost;
}