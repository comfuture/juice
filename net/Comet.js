__TOP__.namespace('net');

__TOP__.net.Comet = function(url, options) {


	this.listen = function() {
		var onReconnect = function(e) {
			$(this).success(onReconnect).failure(onReconnect);
		}
		var listener = $.ajax(url, options)
			.success(onReconnect)
			.failure(onReconnect);
	}
}