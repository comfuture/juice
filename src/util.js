if ('undefined' == typeof Function.prototype.bind) {	// cause webkit already has bind method
	Function.prototype.bind = function(scope) {
		var _function = this;
	  
		return function() {
			return _function.apply(scope, arguments);
		}
	}
}

(function($, juice) {
	$.extend(juice, {
		unique: function(arr) {
			var vals = arr;
			var uniques = [];
			for (var i = vals.length; i--;) {
				var val = vals[i];
				if ($.inArray(val, uniques) == -1) {
					uniques.unshift(val);
				}
			}
			return uniques;
		}
	});
})(jQuery, juice);
 
