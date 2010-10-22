__TOP__.namespace('ui');

(function($) {

	/**
	 * Javascript templating engine
	 * 
	 * @param {String} source
	 * @param {Object} context
	 */
	__TOP__.ui.Template = function(source, context) {
		var tpl = this;
		this.source = source;
		this.compiled = {};
		this.context = context || {};
		if (typeof this.source == 'string') {
			(function() {
				// <!> be aware of regular expression special chars
				var loopBegin = ['<!--{@','}-->'];
				var loopEnd   = ['<!--{/','}-->'];
	
				var src = tpl.source;
				var t = {'self': src || '{$}'};
				
				// clean source
				src = src.replace(new RegExp(loopBegin[1] + '\\s+', 'g'), loopBegin[1]);
				src = src.replace(new RegExp('\\s+' + loopEnd[0], 'g'), loopEnd[0]);
	
				var exists = new RegExp(loopBegin[0] + '([a-z][a-z0-9_\.]+)' + loopBegin[1],'ig');
				while (exists.test(src)) {
					var name = RegExp.$1;
					var beginTag = loopBegin[0] + name + loopBegin[1];
					var endTag = loopEnd[0] + name + loopEnd[1];
					var sub = new RegExp(beginTag + '(.*?)' + endTag,'ig');
					if (sub.test(src)) {
						var content = RegExp.$1;
						t[name] = '{$}';
						t[name + '[*]'] = content;
						src = src.replace(sub, '{' + name + '}');
					}
				}
				t['self'] = src;
				tpl.compiled = t;
			})();
		};/* else if (typeof this.source == 'object') {
			tpl.compiled = source;
		};*/

		this.render = function(vars) {
			if (vars){
				$.extend(tpl.context, vars);
			}

			var self = tpl.context;
			var rules = tpl.compiled;
			var T = {
				output: false,
				init: function() {
					for (var rule in rules)
						if (rule.substr(0,4) != "self")
							rules["self."+rule] = rules[rule];
					return this;
				},
				apply: function(expr) {
					var trf = function(s){ return s.replace(/{([A-Za-z0-9_\$\.\[\]\'@\(\)]+)}/g, 
													 function($0,$1){return T.processArg($1, expr);})},
						 x = expr.replace(/\[[0-9]+\]/g, "[*]"), res;
					if (x in rules) {
						if (typeof(rules[x]) == "string")
							res = trf(rules[x]);
						else if (typeof(rules[x]) == "function")
							res = trf(rules[x](eval(expr)).toString());
					}
					else 
						res = T.eval(expr);
					return res;
				},
				processArg: function(arg, parentExpr) {
					var expand = function(a,e){return (e=a.replace(/^\$/,e)).substr(0,4)!="self" ? ("self."+e) : e; },
						 res = "";
					T.output = true;
					if (arg.charAt(0) == "@")
						res = eval(arg.replace(/@([A-za-z0-9_]+)\(([A-Za-z0-9_\$\.\[\]\']+)\)/, 
													  function($0,$1,$2){return "rules['self."+$1+"']("+expand($2,parentExpr)+")";}));
					else if (arg != "$")
						res = T.apply(expand(arg, parentExpr));
					else
						res = T.eval(parentExpr);
					T.output = false;
					return res;
				},
				eval: function(expr) {
					var v = eval(expr), res = "";
					if (typeof(v) != "undefined") {
						if (v instanceof Array) {
							for (var i=0; i<v.length; i++)
								if (typeof(v[i]) != "undefined")
									res += T.apply(expr+"["+i+"]");
						}
						else if (typeof(v) == "object") {
							for (var m in v)
								if (typeof(v[m]) != "undefined")
									res += T.apply(expr+"."+m);
						}
						else if (T.output)
							res += v;
					}
					return res;
				}
			};
			return T.init().apply('self');
		}
	}
	
	$.fn.render = function(vars) {
		var el = $(this);
		if (el.get(0).tagName == 'SCRIPT' && el.attr('type') == 'text/html') {
			var tpl = new __TOP__.ui.Template(el.html());
			var result = tpl.render(vars);
			el.before(result);
		}
	}
	
	$.fn.jsont = function(url) {
		// retrive from url and transform template
		var el = $(this);
		$.get(url, null, function(result) {
			el.render(result);
		}, 'json');
	}
	
	$.fn.jsonp = function(url, fname) {
		var el = $(this);
		var fn = 'fn' + Math.ceil(Math.random() * 100000);
		window[fn] = function(result) {
			el.render(result);
			delete window[fn];
		}
		var data = {};
		data[fname] = fn;
		$.get(url, data, null, 'script');
	}
})(jQuery);
