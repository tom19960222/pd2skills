
app.filter('htmlSafe', ['$sce', function($sce) {
	return function(text) {
		return $sce.trustAsHtml(text);
	}
}]);

app.filter('skillInfo', ['$sce', function($sce) {
	return function(text) {
		text = text || '';
		text = text.replace(/\[/g, '<strong>').replace(/\]/g, '</strong>');
		return $sce.trustAsHtml(text);
	}
}]);

app.filter('desc', function() {
	return function(array) {
		return array.slice(0).reverse();
	}
});

app.filter('padLeft', function() {
	return function(str, lenght) {
		
		return padLeft(String(str), lenght);
		
		function padLeft(str, lenght){
			if (str.length < lenght) {
				return padLeft('0'+ str, lenght);
			} else {
				return str;
			}
		}
	}
});

function initTree(tree) {
	return {
		"name"  : (typeof tree.name  !== "undefined")? tree.name : "[undefined]",
		"title" : (typeof tree.title !== "undefined")? tree.title : "[undefined]",
		
		"text"  : (typeof tree.text  !== "undefined")? tree.text : "[undefined]",
		"tiers" : (typeof tree.tiers !== "undefined")? tree.tiers : [],
		"used"  : 0
	};
}

function initTier(tier) {
	return {
		"tier"   : (typeof tier.tier   !== "undefined")? tier.tier : -1,
		"skills" : (typeof tier.skills !== "undefined")? tier.skills : [],
		
		"tierUnlockPoint"       : (typeof tier.tierUnlockPoint !== "undefined")? tier.tierUnlockPoint : 0,
		"tierUnlockPointImfamy" : (typeof tier.tierUnlockPointImfamy !== "undefined")? tier.tierUnlockPointImfamy : 0,
		
		"skillUnlockPointBasic" : (typeof tier.skillUnlockPointBasic !== "undefined")? tier.skillUnlockPointBasic : 0,
		"skillUnlockPointAce"   : (typeof tier.skillUnlockPointAce   !== "undefined")? tier.skillUnlockPointAce : -1,
		
		"skillUnlockCostBasic"  : (typeof tier.skillUnlockCostBasic  !== "undefined")? tier.skillUnlockCostBasic : -1,
		"skillUnlockCostAce"    : (typeof tier.skillUnlockCostAce    !== "undefined")? tier.skillUnlockCostAce : 0,
		
		"unlockRequire"   : 0,
		"unlockStatus"    : false
	};
}

function initSkill(skill) {
	return {
		"name"  : (typeof skill.name  !== "undefined")? skill.name : "[undefined]",
		"title" : (typeof skill.title !== "undefined")? skill.title : "[undefined]",
		"basic" : (typeof skill.basic !== "undefined")? skill.basic : "[undefined]",
		"ace"   : (typeof skill.ace   !== "undefined")? skill.ace : "[undefined]",
		"text"  : (typeof skill.text  !== "undefined")? skill.text : "",
		"require" : (typeof skill.require !== "undefined")? skill.require : false,
		
		"ownBasic" : false,
		"ownAce"   : false,
		
		"unlockRequire" : false,
		"unlockBasic"   : false,
		"unlockAce"     : false,
		
		"hover" : false,
		"alert" : false
	};
}
