/**
 * Hash資料存取類別
 */
function HashStorage(location) {
	this.location = location;
	this.datas = {};

	this.loadUrl();
}

HashStorage.fn = HashStorage.prototype;


// ================================================================
// = Hash Control
// ================================================================

/**
 * 載入網址
 */
HashStorage.fn.loadUrl = function() {
	
	var datas = {};
	var hash = this.location.path().replace('/skill/', '');

	// 分割字串
	var parts = hash.split(':');
	
	// 分析字串
	parts.forEach(function(part) {
		if (part == '') return;
		
		// 分割字元
		data = part.match(/([a-zA-Z]\d*)/g);

		// 取標頭
		var header = data.shift();

		// 新增至資料物件
		datas[header] = data;
	});

	this.datas = datas;
}

/**
 * 更新網址狀態
 */
HashStorage.fn.updateUrl = function() {

	// 資料轉字串
	var datas = [];
	for (var header in this.datas) {
		var data = this.datas[header];
		
		if (data.length == 0) continue;

		datas.push(header + data.join(''));
	}

	var hash = 'skill/' + datas.join(':');
	this.location.path(hash);
}


// ================================================================
// = Data Control
// ================================================================

/**
 * 設定值
 */
HashStorage.fn.setData = function(name, value) {
	this.datas[name] = value;
}

HashStorage.fn.unsetData = function() {
	this.datas = {};
}


// ================================================================
// = SkillsCalculator Control
// ================================================================

/**
 * 更新技能樹資料
 */
HashStorage.fn.setTreeData = function(tree) {
	// 宣告計數器
	var counter = 0;
	var data = [];
	
	tree.loopChild(function(tier) {
		
		tier.loopChild(function(skill) {
			
			if (skill.ownBasic) {
				var code = counter + 97;
				if (skill.ownAce) code -= 32;
				
				data.push(String.fromCharCode(code));
			}
			
			// 計數器加一
			counter++;
		});
		
	}); // end forEach tiers
	
	// 取技能樹的標頭
	var header = tree.name.charAt(0).toLowerCase();
	this.setData(header, data);
}

/**
 * 設定技能樹資料
 */
HashStorage.fn.setupSkillTree = function(tree) {
	var header = tree.name.charAt(0).toLowerCase();
	if (typeof this.datas[header] === "undefined") return;
	
	var counter = 0;
	var data = this.datas[header];

	// 字元轉Ascii碼
	data = data.map(function(code) {
		return code.charCodeAt(0);
	});
	
	tree.tiers.forEach(function(tier) {
		
		tier.skills.forEach(function(skill) {
			
			var skillAceCode = counter + 65;
			
			if (data.indexOf(skillAceCode) >= 0) {
				// 擁有 Ace
				skill.ownAce   = true;
				skill.ownBasic = true;
			} else if (data.indexOf(skillAceCode + 32) >= 0) {
				// 擁有 Basic
				skill.ownBasic = true;
			}
			
			// 計數器加一
			counter++;
		});
		
	}); // end forEach tiers
}

/**
 * 設定技能模擬器資料
 */
HashStorage.fn.setupSkillsCalculator = function(skillsCalculator) {
	var self = this;

	skillsCalculator.trees.forEach(function (tree) {
		self.setupSkillTree(tree);
	});
}


// ================================================================
// = PerkDeckCalculator Control
// ================================================================

HashStorage.fn.setPerkDeckCalculatorData = function (perkDeckCalculator) {
	var perk = perkDeckCalculator.getEquippedPerk();
	if (perk == null) return;

	var data = [];
	var perkCode = perk.code.toUpperCase();
	var perkRank = perk.getRank();

	data.push(perkCode + perkRank);

	var header = 'p';
	this.setData(header, data);
}

HashStorage.fn.setupPerkDeckCalculator = function (perkDeckCalculator) {
	var header = 'p';
	if (typeof this.datas[header] === "undefined") return;

	var datas = this.datas[header];

	var dataIndexList = {};
	datas.forEach(function(data) {
		var dataHeader = data.charAt(0);
		var dataValue = data.slice(1);

		dataIndexList[dataHeader] = dataValue;
	});

	perkDeckCalculator.perks.forEach(function(perk) {
		var perkCode = perk.code.toUpperCase();
		if (typeof dataIndexList[perkCode] === "undefined") return;

		var data = dataIndexList[perkCode];

		perk.set();
		perk.setRank(data);
		perkDeckCalculator.updateStatus();
	})
}


// ================================================================
// = Infamy
// ================================================================

/**
 * 更新惡名資料
 */
HashStorage.fn.setInfamy = function(infamysStatus) {
	// 宣告計數器
	var counter = 0;
	var data = [];
	
	infamysStatus.forEach(function(infamy) {
		if (infamy.infamy == true) data.push(infamy.header);
	})
	
	// 取技能樹的標頭
	var header = 'i';
	this.setData(header, data);
}

/**
 * 設定惡名資料
 */
HashStorage.fn.setupInfamy = function(infamysStatus) {
	var header = 'i';
	if (typeof this.datas[header] === "undefined") return;
	
	var counter = 0;
	var data = this.datas[header];

	infamysStatus.forEach(function(infamy) {
		if (data.indexOf(infamy.header) >= 0) infamy.infamy = true;
	})
}