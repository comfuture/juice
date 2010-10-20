/**
 * Juice core framework
 * 
 * @include jquery.js
 */

__NAME__ = 'juice';

(function($){
	var juice = {};
	IS_DYNAMIC = false;{{IS_DYNAMIC}};
	
	var _scripts = document.getElementsByTagName('script');
	for (var i = 0, cnt = _scripts.length; i < _scripts.length; i++) {
		if ('string' == typeof _scripts[i].src) {
			if (_scripts[i].src.match(/juice\.js/)) {
				juice.scriptLoader = _scripts[i].src;
				juice.scriptBasePath = _scripts[i].src.substring(0, _scripts[i].src.indexOf('juice.js'));
				if (IS_DYNAMIC) {
					juice.scriptBasePath += 'juice/';
				}
				break;
			}
		}
	}

	$.URL = function(url) {
		var obj = $.URL.parse(url);
		$.extend(this, obj);
		this.toString = function() {
			var str ='';
			if (this.scheme) str += this.scheme + '://';
			if (this.domain) str += this.domain;
			if (this.path) str += this.path;
			if (this.query.toString().length > 0) str += '?' + $.param(this.query);
			if (this.fragment) str += '#' + this.fragment.replace(/^#+/,'');
			return str;
		};
	};
	
	$.URL.parse = function(url) {
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

	Import = function(pkg) {
		var obj, alias;
		juice.include((pkg + '').replace(/\./g,'/') + '.js', {'onload': function() {
				obj = eval('juice.' + pkg);
				if ('undefined' != typeof alias) {
					window[alias] = obj;
				}
			}
		});
		juice.modules.push(pkg);
		return new function() {
			this.As = function(name) {
				if ('undefined' != typeof obj) {
					window[name] = obj;
				} else {
					alias = name;
				}
			};
		};
	};
	
	From = function(ns) {
		return new function() {
			this.Import = function(name) {
				return Import(ns + '.' + name);
			};
		};
	};

	$.extend(juice, {
		'modules': ['__core__'], 'scripts': [], 'styles': [],
		'options': $.extend({}, new $.URL(juice.scriptLoader).query),
		'namespace': function(ns) {
			if (!ns) return {};

			var levels = ns.split(".");
			var nsobj = juice;

			for (var i=(levels[0] == __NAME__) ? 1 : 0; i<levels.length; ++i) {
				nsobj[levels[i]] = nsobj[levels[i]] || {};
				nsobj = nsobj[levels[i]];
			}
			return nsobj;
		},
		'include': function(source, properties) {
			if (typeof properties == 'function') {
				properties = {'onload': properties};
			}
			properties = $.extend({}, {'onload': $.noop}, properties);
			var realSource = /^https?:\/\//.test(source) ? source : juice.scriptBasePath + source;
			if($.browser.msie) {
				var script = $('<s'+'cript/'+'>')
					.attr('type', 'text/javascript')
					.attr('src', realSource).appendTo($('head')).get(0);
				script.onreadystatechange = function () {
					if (script.readyState == 'complete' || script.readyState=="loaded") {
						properties.onload();
						script.onreadystatechange = null;
					}
				};
			} else {
				var script = $('<s'+'cript/'+'>')
					.attr('type', 'text/javascript')
					.attr('src', realSource).load(properties.onload);
				//delete properties.onload;
				script.attr(properties).appendTo($('head'));
			}
			juice.scripts.push(juice.scriptBasePath + source);
			return juice;
		},
		/**
		 * 
		 * eg)
		 * juice.require('ui.Template,net.Comet');
		 * --
		 * juice.require('ui.Template', 'net.Comet');
		 * --
		 * juice.require('ui.Template')
		 * 		.require('net.Comet')
		 */
		'require': function() {
			if (arguments.length > 0) {
				if (typeof arguments[0] == 'undefined') return juice;
				var modules = $.unique($.makeArray(arguments).join(',').split(','));
				if (IS_DYNAMIC) {
					juice.include('mixer?' + modules.join(','));
				} else {
					$.each(modules, function(i, m) {					
						juice.include(m.replace(/\./gi, '/') +
							(juice.options.debug ? '.debug' : '') +'.js');
					});
				}
				juice.modules = $.unique($.merge(juice.modules, modules));
			}
			return juice;
		},
		'css': function(source, properties){
			return $('<link/>').attr($.extend({}, {
				'rel': 'stylesheet', 'media': 'screen', 'type': 'text/css', 'href': source
			}, properties)).appendTo($('head'));
		},
		'log' : function() {
			if (typeof window.console != 'undefined') {
				console.log.apply(console, arguments);
			}
		}
	});

	if (juice.options.name) {
		__NAME__ = juice.options.name;
	};
	window[__NAME__] = window['__TOP__'] = juice;

	juice.require(juice.options.m);
})(jQuery);