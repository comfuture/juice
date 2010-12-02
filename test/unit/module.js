module('module');

test('Module loader', function() {
	expect(3);
	ok(null != juice.ui.Flash, 'ui.Flash module loaded by ?m=ui.Flash option');
	ok(juice.module.loaded.indexOf('ui.Flash') > -1, 'loaded module name is stored in juice.module.loaded');
	ok(juice.script.loaded.indexOf('../src/ui/Flash.js') > -1, 'loaded script path is stored in juice.script.loaded');

	var onAllLoaded = function() {
		test('Module chain loader', function() {
			expect(3);
			ok(null != juice.sample.A, 'sample.A loaded by sample.B');
			ok(null != juice.sample.B, 'sample.B loaded by self');

			var b = new juice.sample.B();

			ok(b.a instanceof juice.sample.A, 'property a created by sample.B.__init__ is instance of sample.A');
		});
	}
	juice.require('sample.B')(onAllLoaded);
});

