juice.namespace('sample');
juice.require('sample.A');

juice.sample.B = Class({
	__init__: function() {
		this.a = new juice.sample.A();
		juice.log('A and B is loaded');
	}
});
