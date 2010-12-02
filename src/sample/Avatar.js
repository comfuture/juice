juice.namespace('sample');
juice.require('ui.Flash');

juice.sample.Avatar = Class({
	__init__: function() {
		this.flash = new juice.ui.Flash('avatar.swf');
	},

	show: function(el) {
		this.flash.replace($(el));
	}
});
