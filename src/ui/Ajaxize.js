juice.namespace('ui');
/**
 * @constructor juice.ui.Ajaxize
 * Ajaxize html links and forms
 * 
 * @param {jQuery, String} selector
 *   jquery object or css3 selector string
 * 
 * @description
 * new juice.ui.Ajaxize('[rel~=ajax]');
 */
juice.ui.Ajaxize = Class({
	__init__: function(selector) {
		this.selector = selector;
		$(selector).each(function(idx, el) {
			el = $(el);
			var opts = (el.attr('rel') || '').split(' ');
			var hasOption = function(opt) { return opts.indexOf(opt) > -1; };
			var pos = hasOption('before') ? 'Before' : 'After';
			var toggle = hasOption('toggle');
			var increase = hasOption('increase');
			var inherit = hasOption('inherit');
			var del = hasOption('delete');
			var focus = hasOption('focus');
			var insert = hasOption('insert');
			var content_only = hasOption('content-only');
			var target_name = el.attr('target');
			target_name = /#?[a-z][a-z0-9_>\+:\(\)\[\] ]*/i.test(target_name)
				? target_name
				: '#target_' + Math.ceil(Math.random() * 1000000);
			var getTarget = function() {
				var div;
				try {
					div = $(target_name);
				} catch(e) {}
				if (div.length < 1) {
					div = $('<div id="' + target_name.substr(1) + '">')['insert'+pos](el);
				}
				return div;
			};
			if (!increase && !del) {
				el.attr('target', target_name);
			}
			switch (el.get(0).tagName) {
				case 'A':
					el.click(function(event) {
						event.preventDefault();
						var target = getTarget();
						if (target.data('opener') && target.data('opener') != el) {
							target.data('opener').removeClass('toggle-on');
						}
						if (toggle && el.hasClass('toggle-on')) {
							target.empty();
							el.removeClass('toggle-on');
							return;
						}
						if (insert) {
							target.val(el.attr('data-insert'));
						}
						if (focus) {
							target.focus();
						}
						if (del) {
							var do_delete = function() {
								$.ajax({
									'type': 'DELETE',
									'url': el.attr('href'),
									'dataType': 'json',
									'success': function(result) {
										if (result.success) {
											target.css({'opacity':100}).animate({'opacity': 0}, 500, function() {
												target.remove();
											});
											if (el.attr('target').indexOf('#') == -1) {
												location.href = el.attr('target');
											}
										}
									}
								});
							};
							if (el.attr('data-confirm')) {
								if (confirm(el.attr('data-confirm'))) do_delete();
							} else {
								do_delete();
							}
							return;
						}
						target.empty().load(el.attr('href'), function() {
							if (inherit) {
								new Ajaxizer(target_name + ' ' + selector);
							}
							if (increase) target.replaceWith(target.html());
							// <!> XXX: not part of ajaxize functional
							var a = (el.attr('href').split('/').pop().replace('*',''));
							if (focus)
								anchor(target_name);
						}).data('opener', el);
						el.addClass('toggle-on');
					});
					break;
				case 'FORM':
					el.submit(function(event) {
						event.preventDefault();
						var target = getTarget();
						if (toggle && el.hasClass('toggle-on')) {
							target.empty();
							el.removeClass('toggle-on');
							return;
						}
						$.ajax({
							'type': el.attr('method') || 'GET',
							'url': el.attr('action') || document.URL,
							'data': el.serialize(),
							'success': function(html) {
								$html = $(html);
								if (increase) {
									target.replaceWith($html);
								} else {
									target.empty().html($html);
								}
								if (inherit) {
									new Ajaxizer($html.contents().find(selector));
								}
								el.addClass('toggle-on').get(0).reset();
							}
						});
					});
					break;
			}
		});
	}
});
