(function($, juice) { 
	$.extend(juice, {
		'$queue': [],
		'modules': ['__core__'], 'scripts': [], 'styles': [],
		'namespace': function(ns) {
			var scope = function(code) {
				if (code)
					code.apply(this);
				this.toString = function() {
					return '[juice$scope (' + ns + ')]';
				};
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
			return $('<link/>').attr($.extend({
				'rel': 'stylesheet', 'media': 'screen', 'type': 'text/css', 'href': source
			}, properties)).appendTo($('head'));
		},
		'include': function(source, callback) {
			var realSource = /^https?:\/\//.test(source) ? source
					: juice.env.base + source;
			if (juice.options.debug)
				realSource = realSource.replace(/\.js$/, '.debug.js');

			if (callback && juice.scripts.indexOf(realSource))
				callback();
			else {
				$.getScript(source, callback);
				juice.scripts.push(realSource);
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
		 * 		.require('net.Comet')
		 */
		'require': function() {
			if (arguments.length > 0) {
				if (typeof arguments[0] == 'undefined') return juice;
				var modules = $.unique($.makeArray(arguments).join(',').split(','));
				/*	// disabled dynamic loader
				if (IS_DYNAMIC) {
					juice.include('mixer?' + modules.join(','));
				
				} else {
				*/
				if (true) {
					$.each(modules, function(i, m) {					
						juice.include(m.replace(/\./, '/') +'.js');
					});
				}
				juice.modules = $.unique($.merge(juice.modules, modules));
			}
			return juice;
		}
	});
	juice.require(juice.options.m);
})(jQuery, juice);