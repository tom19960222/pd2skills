
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

app.filter('deckClassName', [function() {
	return function(text) {
		text = text || '';

		text = text.toLowerCase();
		text = text.replace(/\s/g, '_');
		text = 'deck-'+ text;

		return text;
	}
}]);