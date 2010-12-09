/**
 * Juice core framework
 * 
 * @include jquery.js
 */

var juice = $.extend(function() {
	$.merge(juice._ready, arguments);
	return juice;	
}, {
	'_ready': [],
	'env': {'fresh':true}
});

var _scripts = document.getElementsByTagName('SCRIPT');
for (var i = 0, cnt = _scripts.length; i < _scripts.length; i++) {
	var src = _scripts[i].getAttribute('src') || '';
	if (_scripts[i].src.match(/juice\.js/)) {
		juice.env.src = src;
		juice.env.base = src.substring(0, src.indexOf('juice.js'));
		break;
	}
}
window.juice = window.j$ = juice;

(function($, juice) {
	
	/**
	 * OOP Style class definition helper
	 * 
	 */
	var Klass = function(code){
		var klass = function() {
			var instance = ('function' == typeof code.__init__)
				? code.__init__.apply(this, arguments || [])
				: this;
			return instance;
		};
		this.toString = function() { return '[object Class]' }
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

	var Juice = Class({
		options: new URL(juice.env.src).query,
		log: function() {
			if (typeof window.console != 'undefined') {
				console.log.apply(console, arguments);
			}
		},
		toString: function() {
			return '[object Juice]';
		}
	});
	$.extend(juice, new Juice);
})(jQuery, juice);
(function($, juice) { 
	$.extend(juice, {
		'$queue': [],
		'module': {
			'loaded': []
		},
		'script': {
			'loaded': []
		},
		'namespace': function(ns) {
			var scope = function(code) {
				if (code)
					code.apply(this);
				return scope;
			};
			
			if (!ns) return juice;

			var levels = ns.split(".");
			var nsobj = juice;

			for (var i=(levels[0] == 'juice') ? 1 : 0; i<levels.length; ++i) {
				nsobj[levels[i]] = nsobj[levels[i]] || scope();
				nsobj = nsobj[levels[i]];
			}
			return nsobj;
		},
		'css': function(source, properties){
			var link = document.createElement('link');
			link.href = source;
			link.rel = 'stylesheet';
			link.type = 'text/css';
			$('head').get(0).appendChild(link);
			return juice;
		},
		'include': function(source, callback) {
			callback = callback || function() {};
			var realSource = /^https?:\/\//.test(source) ? source
					: juice.env.base + source;
			if (juice.options.debug)
				realSource = realSource.replace(/\.js$/, '.debug.js');

			if (juice.script.loaded.indexOf(realSource) > -1)
				callback();
			else {
				juice.$queue.push(realSource);
				var wrapper = function(e) {
					var found = juice.$queue.indexOf(realSource);
					if (found > -1)
						juice.script.loaded.push(juice.$queue.splice(found, 1)[0]);
					callback();
					juice._checkReady();
				}
				var script = document.createElement('script');
				script.setAttribute('type', 'text/javascript');
				script.src = realSource;
				if($.browser.msie) {
					script.onreadystatechange = function () {
						if (script.readyState == 'complete' || script.readyState=="loaded") {
							wrapper();
							script.onreadystatechange = null;
						}
					}
				} else {
					script.addEventListener('load', wrapper, true);
				}
				$('head').get(0).appendChild(script);
			}
			return juice;
		},
		'embed': function(source) {
			this.include(source);
		},
		'_checkReady': function() {
			if (juice.$queue.length > 0) return;
			$.each(juice._ready, function(i, f) {
				f();
			});
			juice._ready = [];
		},
		/**
		 * 
		 * eg)
		 * juice.require('ui.Template,net.Comet');
		 * --
		 * juice.require('ui.Template', 'net.Comet');
		 * --
		 * juice.require('ui.Template')
		 * 		.require('net.Comet');
		 * --
		 * juice.require('ui.Template,net.Commet', cb);
		 * --
		 * juice.require('ui.Template', 'net.Comet', cb);
		 * --
		 * juice.require('ui.Template', 'net.Comet')(cb);
		 */
		'require': function() {
			var args = $.makeArray(arguments);
			if (args.length > 0) {
				if (typeof args[0] == 'undefined') return juice;
				var callback = function() {
					clearTimeout(this.timeout);
					// XXX: take care of race condition
					var found = juice.$queue.indexOf(this.module);
					if (found > -1)
						juice.module.loaded.push(juice.$queue.splice(found, 1)[0]);
					juice._checkReady();
				};
				if (typeof args[args.length-1] == 'function')
					juice._ready.push(args.pop());
				var modules = juice.unique(args.join(',').split(/[,;]/));
				/*
				if (juice.env.frech) {
					juice.include('mixer?' + modules.join(','));				
				} else {
				*/
				if (true) {
					$.each(modules, function(i, m) {
						if (juice.module.loaded.indexOf(m) > -1 || juice.$queue.indexOf(m) > -1) return juice._checkReady();
						var t = setTimeout(function() {
							var found = juice.$queue.indexOf(m);
							if (found > -1)
								juice.$queue.splice(found, 1);
							juice._checkReady();
						}, 5000);
						juice.$queue.push(m);
						juice.include(m.replace(/\./, '/') +'.js', callback.bind({'module':m, 'timeout':t}));
					});
				}
			}
			return juice;
		}
	});
	juice.require(juice.options.m);
})(jQuery, juice);
