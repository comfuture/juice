(function($, juice) { 
	$.extend(juice, {
		'$queue': [],
		'modules': ['__core__'], 'scripts': [], 'styles': [],
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
			return $('<link/>').attr($.extend({
				'rel': 'stylesheet', 'media': 'screen', 'type': 'text/css', 'href': source
			}, properties)).appendTo($('head'));
		},
		'include': function(source, callback) {
			callback = callback || function() {};
			var realSource = /^https?:\/\//.test(source) ? source
					: juice.env.base + source;
			if (juice.options.debug)
				realSource = realSource.replace(/\.js$/, '.debug.js');

			if (juice.scripts.indexOf(realSource) > -1)
				callback();
			else {
				$.getScript(realSource, callback);
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
				arguments = $.makeArray(arguments);
				var callback = function() {};
				if (typeof arguments[arguments.length-1] == 'function')
					callback = arguments.pop();
				var modules = $.unique(arguments.join(',').split(','));
				/*
				if (juice.env.frech) {
					juice.include('mixer?' + modules.join(','));				
				} else {
				*/
				if (true) {
					$.each(modules, function(i, m) {					
						juice.include(m.replace(/\./, '/') +'.js', callback);
					});
				}
				juice.modules = $.unique($.merge(juice.modules, modules));
			}
			return juice;
		}
	});
	juice.require(juice.options.m);
})(jQuery, juice);
