/*
jquery.flash v1.3.2 -  18/02/10
(c)2009 Stephen Belanger - MIT/GPL.
http://docs.jquery.com/License
*/

if('undefined' == typeof Array.prototype.indexOf) {
	// IE uses a 5 year old version of Javascript, so let's add the missing indexOf method in manually.
	Array.prototype.indexOf = function(o,i){
		for(var j = this.length, i = i < 0 ? i + j < 0 ? 0 : i + j : i || 0; i < j && this[i] !== o; i++);
		return j <= i ? - 1 : i;
	};
}

juice.capacity = {
	/**
	 * @returns flash version array eg) ['10','0','0']
	 */
	flashversion: function() {
		if($.browser.msie) {
			try {
				var axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.7");
			} catch(e) {
				try {
					var axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.6");
					return [6, 0, 21];
				} catch(e) {};
				try {
					axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash");
				} catch(e) {};
			}
			if (axo != null) {
				return axo.GetVariable("$version").split(" ")[1].split(",");
			}
		} else {
			var p = navigator.plugins;
			var f = p['Shockwave Flash'];
			if (f && f.description)
				return f.description.replace(/([a-zA-Z]|\s)+/, "").replace(/(\s+r|\s+b[0-9]+)/, ".").split(".");
			else if (p['Shockwave Flash 2.0'])
				return '2.0.0.11';
		}
	},

	/**
	 * @returns flash enabled
	 */
	hasflash: function() {
		return (juice.capacity.flashversion())
			? true
			: false;
	}
}

juice.namespace('ui');

juice.ui.Flash = Class({
	__init__: function(options) {
		if ('string' == typeof options)
			options = {'src': options};
		if (arguments.length > 1 && $.type(arguments[1]) == 'object')
			$.extend(options, arguments[1]);
		this.options = $.extend({
			'wmode': 'opaque'
		}, options);
	},

	_merge: function(el) {
		var el = $(el);
		return $.extend({
			'id': el.attr('id'),
			'class': el.attr('class'),
			'width': el.width(),
			'height': el.height(),
			'src': el.attr('href'),
		}, this.options);
	},

	_build: function(options) {
		var attr = function(a, b) { return ' ' + a + '="' + b + '"'; },
		    param = function(a, b) { return '<param name="' + a + '" value="' + b + '" />'; },
		    s = $.extend({
				'classid': 'clsid:D27CDB6E-AE6D-11cf-96B8-444553540000',
				'pluginspace': 'http://get.adobe.com/flashplayer',
				'availattrs': ['id', 'class', 'width', 'height', 'src'],
				'availparams': ['src', 'bgcolor', 'quality', 'allowscriptaccess', 'allowfullscreen', 'flashvars', 'wmode'],
				'version': '9.0.24'
			}, options),
			a = s.availattrs,
			p = s.availparams,
			rv = s.version.split('.'),
			o = '<object';

		if (!s.codebase) {
			s.codebase = (("https:" == document.location.protocol)
				? 'https://'
				: 'http://')
				+ 'download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=' + rv.join(',');
		}
		
		if (s.express) {
			for (var i in cv) {
				if (parseInt(cv[i]) > parseInt(rv[i])) {
					break;
				}
				if (parseInt(cv[i]) < parseInt(rv[i])) {
					s.src = s.express;
				}
			}
		}

		if (s.flashvars) {
			s.flashvars = unescape($.param(s.flashvars));
		}
		a = $.browser.msie ? a.concat(['classid', 'codebase']) : a.concat(['pluginspage']);

		for (k in a) {
			var n = (k == a.indexOf('src')) ? 'data' : a[k];
			o += s[a[k]] ? attr(n, s[a[k]]) : '';
		};
		o += '>';

		for (k in p) {
			var n = (k == p.indexOf('src')) ? 'movie' : p[k];
			o += s[p[k]] ? param(n, s[p[k]]) : '';
		};

		o += '</object>';
		return o;
	},

	appendTo: function(el) {
		$(el).append(this._build(this.options));
	},

	replace: function(el) {
		$(el).replaceWith(this._build(this._merge(el)));
	}
});

$.fn.extend({
	flash: function (options) {
		var flash = new juice.ui.Flash(options);
		flash.replace($(this));
		return this;
	}
});
