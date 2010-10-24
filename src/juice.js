/**
 * Juice core framework
 * 
 * @include jquery.js
 */
IS_DYNAMIC = false;{{IS_DYNAMIC}}; 
var juice = {env:{fresh:true}};

var _scripts = document.getElementsByTagName('SCRIPT');
for (var i = 0, cnt = _scripts.length; i < _scripts.length; i++) {
	if ('string' == typeof _scripts[i].src) {
		if (_scripts[i].src.match(/juice\.js/)) {
			juice.env.src = _scripts[i].src;
			juice.env.base = _scripts[i].src.substring(0, _scripts[i].src.indexOf('juice.js'));
			break;
		}
	}
}
window.juice = window.j$ = juice;

// development
juice.env.fresh = false;
var all = ['core.js', 'module.js'];
for (i = 0, cnt=all.length; i < cnt; i++) {
	document.write('<s' + 'cript type="text/javascript" src="' + juice.env.base
			+ all[i] + '"></s' + 'cript>');
}
// /development
