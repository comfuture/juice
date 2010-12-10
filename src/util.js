if ('undefined' == typeof Function.prototype.bind) {	// cause webkit already has bind method
	Function.prototype.bind = function(scope) {
		var _function = this;
	  
		return function() {
			return _function.apply(scope, arguments);
		}
	};
}

if ('undefined' == typeof Array.prototype.map) {
	Array.prototype.map = function(fun /*, thisp*/) {
		var len = this.length;
		if (typeof fun != "function")
			throw new TypeError();

		var res = new Array(len);
		var thisp = arguments[1];
		for (var i = 0; i < len; i++) {
			if (i in this)
				res[i] = fun.call(thisp, this[i], i, this);
		}
		return res;
	};
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
 
