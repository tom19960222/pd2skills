

app.filter('htmlSafe', ['$sce', function($sce) {
	return function(text) {
		return $sce.trustAsHtml(text);
	}
}]);


app.filter('skill', [function() {
	return function(skill) {
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
}]);

app.filter('tier', [function() {
	return function(tier) {
		return {
			"tier"   : (typeof tier.tier   !== "undefined")? tier.tier : "[undefined]",
			"skills" : (typeof tier.skills !== "undefined")? tier.skills : [],
			
			"skillUnlockPoint" : (typeof tier.skillUnlockPoint !== "undefined")? tier.skillUnlockPoint : "[undefined]",
			"skillUnlockCost"  : (typeof tier.skillUnlockCost  !== "undefined")? tier.skillUnlockCost : "[undefined]",
			
			"tierUnlockPoint" : (typeof tier.tierUnlockPoint !== "undefined")? tier.tierUnlockPoint : "[undefined]",
			"unlockRequire"   : 0,
			"unlockStatus"    : false
		};
	}
}]);

app.filter('tree', [function() {
	return function(tree) {
		return {
			"name"  : (typeof tree.name  !== "undefined")? tree.name : "[undefined]",
			"title" : (typeof tree.title !== "undefined")? tree.title : "[undefined]",
			
			"text"  : (typeof tree.text  !== "undefined")? tree.text : "[undefined]",
			"tiers" : (typeof tree.tiers !== "undefined")? tree.tiers : []
		};
	}
}]);

