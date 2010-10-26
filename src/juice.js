/**
 * Juice core framework
 * 
 * @include jquery.js
 */
var juice = {env:{fresh:true}};

var _scripts = document.getElementsByTagName('SCRIPT');
for (var i = 0, cnt = _scripts.length; i < _scripts.length; i++) {
	var src = _scripts[i].getAttribute('src') || '';
	if (_scripts[i].src.match(/juice\.js/)) {
		juice.env.src = src;
		juice.env.base = src.substring(0, src.indexOf('juice.js'));
		break;
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
