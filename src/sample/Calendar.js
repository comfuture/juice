juice.namespace('sample');

juice.include('http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.6/jquery-ui.min.js')
     .css('http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.6/themes/flick/jquery-ui.css')
	 .require('ui.Form')

(function() {

juice.sample.Calendar = Class({
	__init__: function() {
	},

	draw: function() {
		$('<div id="dp">').appendTo($('body')).datepicker();
	}
});

var cal = new juice.sample.Calendar();
cal.draw();

});
