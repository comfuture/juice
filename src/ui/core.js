juice.namespace('ui');
juice.include('http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.6/jquery-ui.min.js');

juice.ui.theme = function(theme) {
	juice.css('http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.6/themes/' + theme  + '/jquery-ui.css');
}
juice.ui.theme(juice.options.t || 'base');
juice(function() {
	// html5 element hot fix
	var types = {'date':'datepicker', 'datetime':'', 'range':'slider', 'number':''};
	$.each(types, function(t, f) {
		var el = document.createElement('input');
		el.setAttribute('type', t);
		var support = (el.type == t);
		if (!support) {
			try { $('input[type='+t+']')[f](); } catch(e) {}
		}
	});
});
