/**
 * Infamy 資料存取類別
 */
function SkillsInfamyStorage() {
	this.infamyStatus = [
		{
			header	: 'b',
			infamy 	: false
		},
		{
			header	: 'c',
			infamy 	: false
		},
		{
			header	: 'd',
			infamy 	: false
		},
		{
			header	: 'e',
			infamy 	: false
		}
	];
}

SkillsInfamyStorage.fn = SkillsInfamyStorage.prototype;

SkillsInfamyStorage.fn.update = function(skillsCalculator) {
	var infamyStatus = this.infamyStatus;

	var infamys = [];
	var the5th = false;
	for (var i in infamyStatus) {
		var infamy = infamyStatus[i].infamy;
		infamys.push(infamy);
		the5th = (the5th || infamy);
	}

	infamys.push(the5th);

	infamys.forEach(function(infamyStatus, treeIndex) {
		skillsCalculator.trees[treeIndex].setInfamy(infamyStatus);
	});

	
}