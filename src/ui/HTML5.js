// vim: set ts=4:
juice.namespace('ui');

/**
 * 
 * ex) build html5 element tree
 *  var tmp = {};
 *  with (HTML5()) {
 *		var dom = div({id:'item'}, [
 *			figure([
 *				img({src: 'asset/image.png', width:90, height:90})
 *			]),
 *			h4('item name').$(tmp, 'h4'),
 *			button('buy').on('click', function(event) {
 *				alert('buy this item');
 *			}),
 *			span('rating').append(img({'src':'asst/star.png'}, 5))
 *		]);
 *		dom.appendTo($('#item_list'));
 * 
 *		tmp.h4.prepend(span({'class': 'new'}, 'new'));
 *	}
 */
juice.ui.HTML5 = (function($) {

	function Tag(name, properties, children) {
		var el = $('<'+name+'>').attr(properties);
		if (children && children.length > 0) { 
			$.each(children, function(i, child) {
				el.append(child);
			});
		}
		return el;
	}
	
	$.fn.$ = function(obj, prop) {
		obj[prop] = this;
		return this;
	};

	var tagNames = ['a', 'abbr', 'acronym', 'address', 'applet', 'area',
		'article', 'aside', 'audio', 'b', 'base', 'basefont', 'bdo', 'big',
		'blockquote', 'body', 'br', 'button', 'canvas', 'caption', 'center',
		'cite', 'code', 'col', 'colgroup', 'command', 'datagrid', 'datalist',
		'datatemplate', 'dd', 'del', 'details', 'dialog', 'dir', 'div', 'dfn',
		'dl', 'dt', 'em', 'embed', 'eventsource', 'fieldset', 'figure', 'font',
		'footer', 'form', 'frame', 'frameset', 'h1', 'h2', 'h3', 'h4', 'h5',
		'h6', 'head', 'header', 'hr', 'html', 'i', 'iframe', 'img', 'input',
		'ins', 'isindex', 'input', 'kbd', 'label', 'legend', 'li', 'link',
		'mark', 'map', 'menu', 'meta', 'meter', 'nav', 'nest', 'noframes',
		'noscript', 'object', 'ol', 'optgroup', 'option', 'output', 'p',
		'param', 'pre', 'progress', 'q', 'rule', 's', 'samp', 'script',
		'section', 'select', 'small', 'source', 'span', 'strike', 'strong',
		'style', 'sub', 'sup', 'table', 'tbody', 'td', 'textarea', 'tfoot', 'th',
		'thead', 'time', 'title', 'tr', 'tt', 'u', 'ul', 'var', 'video', 'xmp'];
	var HTML5 = Class({
		__init__: function() {
			HTML5.instance = this;
			$.each(tagNames, function(i, tag) {
				HTML5.instance[tag] = function() {
					var kwargs = {
						html:null, properties: {}, children: [], repeat: false
					};
					for (var i = 0, cnt = arguments.length; i < cnt; i++) {
						var arg = arguments[i];
						kwargs[($.isArray(arg))
							? 'children'
							: (typeof arg == 'string')
								? 'html'
								: (typeof arg == 'number')
									? 'repeat'
									: 'properties'
						] = arg;
					}
					var dom = Tag(tag, kwargs.properties, kwargs.children);
					if (kwargs.html)
						dom.html(kwargs.html);
					if (typeof kwargs.repeat == 'number' && kwargs.repeat > 0) {
						var ret = [];
						for (var i = 0; i < kwargs.repeat; i++) {
							ret.push(dom.clone());
						}
						return ret;
					}
					return dom;
				};
			});
		}
	});
	return HTML5.instance || new HTML5();
})(jQuery);
