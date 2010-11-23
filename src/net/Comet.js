juice.namespace('net');

juice.net.Comet = Class({
	'__init__': function(url, options) {
		this.url = url;
		this.options = options;
		if (url && options)
			this.listen();
	},
	'listen': function() {
		var onReconnect = function(event) {
			$(this).success(onReconnect).failure(onReconnect);
		}
		var listener = $.ajax(this.url, this.options)
			.success(onReconnect)
			.failure(onREconnect);
	}
});
