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
