(function($, juice) { 
	$.extend(juice, {
		'$queue': [],
		'modules': [],
		'scripts': [],
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
		'include': function() {
			if (arguments.length == 1 && 'function' == $.type(arguments[0])) {
				juice.$queue.push(arguments[0]);
				return juice.working ? juice : juice.cue();
			}
			var lazy = [];
			while ('function' == $.type(juice.$queue[juice.$queue.length - 1])) {
				lazy.unshift(juice.$queue.pop());
			}
			var args = $.makeArray(arguments);
			juice.$queue.push(args);
			$.each(lazy, function(i, f) {
				juice.$queue.push(f);
			});
			return juice.working ? juice : juice.cue();
		},
		/**
		 * @alias juice.include
		 * this methos is same with juice.include but it will replaced to entire source code of given filename by build script
		 * 
		 */
		'embed': function(source) {
			return this.include(source);
		},
		'cue': function() {
			if (juice.$queue.length == 0) {
				juice.working = false;
				return;
			}
			juice.working = true;
			var item = juice.$queue.shift();
			switch ($.type(item)) {
				case 'function':
					item();
					return juice.cue();
				case 'array':
					var queue = [];
					var check = function() {
						if (queue.length == 0)
							juice.cue();
					}
					$.each(item, function(i, s) {
						if ('string' == $.type(s)) {
							queue.push(s);
							var callback = function(e) {
								var found = queue.indexOf(s);
								if (found > -1) {
									juice.scripts.push(queue.splice(found, 1)[0]);
								}
								check();
							}
							var script = document.createElement('script');
							script.setAttribute('type', 'text/javascript');
							script.src = s;
							if ($.browser.msie) {
								if (['complete', 'loaded'].indexOf(script.readyState)) {
									callback();
									script.onreadystatechange = null;
								}
							} else {
								script.addEventListener('load', callback, true);
							}
							$('head').get(0).appendChild(script);
						} else if ('function' == $.type(s)) {
							juice.$queue.push(s);
						}
					});
			}
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
				var modules = juice.unique(args.join(',').split(/[,;]/));
				/*
				if (juice.env.frech) {
					juice.include('mixer?' + modules.join(','));				
				} else
				*/
				if (true) {
					var scripts = modules.map(function(item) {
						if ($.type(item) == 'string') {
							juice.$queue.push(function() { juice.modules.push(item) });
							return juice.env.base + item.replace(/\./, '/') + '.js';
						}
						return item;
					});
					return juice.include.apply(juice, scripts);
				}
			}
			return juice;
		}
	});
	juice.require(juice.options.m);
})(jQuery, juice);
