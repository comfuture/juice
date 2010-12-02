juice.namespace('ui');
juice.require('ui.core');

juice.ui.Form = Class({
	__init__: function(form) {
		this.form = $(form);
		this.form.data('helper', this);
		if (this.form.attr('data-validate')) {
			this.form.submit(this.validate);
		}
	},

	validate: function(event) {
		// do something...
		event.preventDefault();
	},

	_feedback: function(message) {
		alert(message);
	}
});
