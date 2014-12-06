/**
 * Hash資料存取類別
 */
function SkillsHashStorage(location) {
	this.location = location;
	this.datas = {};

	this.loadUrl();
}

SkillsHashStorage.fn = SkillsHashStorage.prototype;

/**
 * 載入網址
 */
SkillsHashStorage.fn.loadUrl = function() {
	
	var datas = {};
	var hash = this.location.path().replace('/skill/', '');

	// 分割字串
	var parts = hash.split(':');
	
	// 分析字串
	parts.forEach(function(part) {
		if (part == '') return;
		
		// 分割字元
		data = part.split('');

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
SkillsHashStorage.fn.updateUrl = function() {

	// 資料轉字串
	var datas = [];
	for (var header in this.datas) {
		datas.push(header + this.datas[header].join(''));
	}

	var hash = 'skill/' + datas.join(':');
	this.location.path(hash);
}

/**
 * 設定值
 */
SkillsHashStorage.fn.setData = function(name, value) {
	this.datas[name] = value;
}

SkillsHashStorage.fn.unsetData = function() {
	this.datas = {};
}

/**
 * 設定技能樹資料
 */
SkillsHashStorage.fn.setTreeData = function(tree) {
	// 宣告計數器
	var counter = 0;
	var data = [];
	
	tree.tiers.forEach(function(tier) {
		
		tier.skills.forEach(function(skill) {
			
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
 * 更新技能樹資料
 */
SkillsHashStorage.fn.updateTreeData = function(tree) {
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