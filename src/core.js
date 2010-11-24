(function($, juice) {
	
	/**
	 * OOP Style class definition helper
	 * 
	 */
	var Klass = function(code){
		var klass = function() {			
			if(null != arguments[0]){
				var instance = (null != arguments[0] && this.__init__ && 'function' == typeof this.__init__) ? code.__init__.apply(this, arguments) : this ;
				return instance;
			}else{
				var instance = (this.__init__ && 'function' == typeof this.__init__) ? code.__init__.apply(this) : this ;
				return instance;
			}			
		};
		$.extend(klass, this);
		$.extend(klass.prototype, {
			'bind': function(type, fn) {
				this.__events__ = this.__events__ || {};
				this.__events__[type] = this.__events__[type] || [];
				this.__events__[type].push(fn);
				return this;
			},

			'unbind': function(type, fn) {
				if (this.__events__ && this.__events__[type]) {
					this.__events__[type].splice(this.__events__[type].indexOf(fn), 1);
				}
				return this;
			},

			'trigger': function(type) {
				var args = $.makeArray(arguments); args.shift();
				if (this.__events__ && this.__events__[type]){
					var evt = $.Event(type);
					evt.target = this;
					$.each(this.__events__[type], function(idx, fn) {
						fn.apply(this, $.merge([evt], args || []));
					});
				}
				return this;
			}
		}, code);

		klass.constructor = Klass;
		return klass;
	};

	var mixin = function(previous, current){
		if (previous && previous != current){
			var type = typeof current;
			if (type != typeof previous) return current;
			switch(type){
				case 'function':
					var merged = function(){
						this.parent = arguments.callee.parent;
						return current.apply(this, arguments);
					};
					merged.parent = previous;
					return merged;
				case 'object': return $.merge(previous, current);
			}
		}
		return current;
	};

	$.extend(true, Klass.prototype, {
		'extend': function(properties) {
			var proto = new this(null);
			for (var property in properties){
				var pp = proto[property];
				proto[property] = mixin(pp, properties[property]);
			}
			return new Klass(proto);
		},

		'implement': function() {
			for (var i = 0, l = arguments.length; i < l; i++)
				$.extend(this.prototype, arguments[i]);
		}
	});

	window.Class = function(code) {
		return new Klass(code);
	};
	
	/**
	 * URL
	 * 
	 */
	
	var URL = Class({
		__init__: function(url) {
			var parse = function(url) {
				var ptn = /^(?=[^&])(?:([^:\/?#]+):)?(?:\/\/([^\/?#]*))?([^?#]*)(?:\?([^#]*))?(?:#(.*))?/;
				var match = ptn.exec(url);
				return {
					scheme  : match[1],
					domain  : match[2],
					path    : match[3],
					query   : (function(query) {
						var qa = {};
						query = decodeURIComponent(query);
						query.replace(/([^=]+)=([^&]*)(&|$)/g, function(){
							qa[arguments[1]] = arguments[2];
							return arguments[0];
						});
						return qa;
					})(match[4]),
					fragment: match[5]
				};
			};
			$.extend(this, parse(url));
		},
		toString: function() {
			var str ='';
			if (this.scheme) str += this.scheme + '://';
			if (this.domain) str += this.domain;
			if (this.path) str += this.path;
			if (this.query.toString().length > 0) str += '?' + $.param(this.query);
			if (this.fragment) str += '#' + this.fragment.replace(/^#+/,'');
			return str;
		}
	});
	
	window.URL = URL;

	$.extend(juice, {
		'options': $.extend({}, new URL(juice.env.src).query),
		'log' : function() {
			if (typeof window.console != 'undefined') {
				console.log.apply(console, arguments);
			}
		}
	});
})(jQuery, juice);
