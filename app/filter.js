
// ================================================================
// = 常用
// ================================================================

/**
 * 過濾特殊符號
 */
app.filter('htmlSafe', ['$sce', function($sce) {
	return function(text) {
		return $sce.trustAsHtml(text);
	}
}]);

/**
 * Array降序排列
 */
app.filter('desc', [function() {
	return function(array) {
		return array.slice(0).reverse();
	}
}]);

/**
 * 轉換為陣列
 */
app.filter('toArray', [function() {
	return function(arg) {
		return (arg instanceof Array)? arg : [arg];
	}
}]);

/**
 * 字串左邊補0
 */
app.filter('padLeft', [function() {
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
}]);


// ================================================================
// = 自定義
// ================================================================

/**
 * 
 */
app.filter('asideText', ['$sce', function($sce) {
	return function(text) {
		text = text || '';
		text = text.replace(/\[/g, '<strong>').replace(/\]/g, '</strong>');
		return $sce.trustAsHtml(text);
	}
}]);

/**
 * 痾...
 */
app.filter('deckClassName', [function() {
	return function(text) {
		text = text || '';

		text = text.toLowerCase();
		text = text.replace(/\s/g, '_');
		text = 'deck-'+ text;

		return text;
	}
}]);