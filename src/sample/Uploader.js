juice.namespace('sample');
juice.require('ui.Flash')	// <!> be careful! this line not contains ';'

(function() {

juice.sample.Uploader = juice.ui.Flash.extend({
	__init__: function() {
		this.parent('uploader.swf');
		this.replace($('<div id="uploader">').append($('body')));
	}
});

});
