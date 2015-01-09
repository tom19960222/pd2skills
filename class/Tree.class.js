/**
 * 技能樹類別
 */
function Tree(parent) {
	// 防止未經 new 建構類別
	if ( ! this instanceof Tree) return new Tree(parent);

	this._parent = parent;
	this.childList = [];

	this.name	= "";
	this.title	= "";
	this.text	= "";

	this.usedPoint	= 0;
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
	this.callChildsUpdateTree();
}

/**
 * 重設技能樹
 */
Tree.fn.unset = function(tree) {
	this.getChild(0).getChild(0).unset();
}

/**
 * 設定惡名
 */
Tree.fn.setInfamy = function(bool) {
	if (typeof bool !== "boolean") return false;
	if (this.infamy !== bool) {
		this.infamy = bool;
		this.callParentUpdate();
	};
}


// ================================================================
// = Hash
// ================================================================

Tree.fn.encode = function() {

	var data = [];

	var timer = 0;		
	tree.loopChild(function(tier) {
		
		tier.loopChild(function(skill) {
			
			if (skill.ownBasic) {
				var code = timer + 97;
				if (skill.ownAce) code -= 32;
				
				data.push(String.fromCharCode(code));
			}
			
			// 計數器加一
			timer++;
		});
		
	}); // end forEach tiers
	
	// 取標頭
	var header = this.name;
	header = header.charAt(0);
	header = header.toLowerCase();

	// 回傳
	var re = {};
	re[header] = data;

	return re;
}

Tree.fn.decode = function(storage) {

	var header = tree.name.charAt(0).toLowerCase();
	if (typeof storage[header] === "undefined") return;
	
	var data = storage[header];		
	// 字元轉Ascii碼
	data = data.map(function(code) {
		return code.charCodeAt(0);
	});
	

	var timer = 0;
	this.loopChild(function(tier) {
		
		tier.loopChild(function(skill) {
			
			var codeAce = timer + 65;
			var codeBasic = codeAce + 32;
			
			if (data.indexOf(codeAce) >= 0) {
				// 擁有 Ace
				skill.ownAce   = true;
				skill.ownBasic = true;
			} else if (data.indexOf(codeBasic) >= 0) {
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
	this.updateStatus();
	this._parent.callParentUpdate();
}

/**
 * 向下呼叫 更新技能樹
 */
Tree.fn.callChildsUpdateTree = function () {
	var usedPoint = 0;
	
	this.loopChild(function(child) {
		usedPoint += child.callChildsUpdateTree(usedPoint)
	});

	return this.usedPoint = usedPoint;
}