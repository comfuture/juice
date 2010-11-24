module('core');

test('Oop', function() {
	var Animal = Class({
		__init__: function() {
			this.inteligent = 10;
		},
		say: function() {
			this.trigger('say', this.voice || '...');
		}
	});

	var Cat = Animal.extend({
		__init__: function() {
			this.voice = 'mew~';
		}
	});

	var Human = Animal.extend({
		__init__: function() {
			this.inteligent = 120 + Math.ceil(30 - Math.random() * 10);
		}
	});

	var NoArgument = Class({
		foo: function() {
			juice.log('foo');
		}
	});

	var WithArgument = Class({
		__init__: function(arg1) {
			this.arg1 = arg1;
		}
	});

	var cat = new Cat();
	var maroo = new Human();
	var noargs = new NoArgument();
	var withargs = new WithArgument('test');

	ok(cat instanceof Cat, 'Cat class can be instance');
	equal(cat.voice, 'mew~', 'Cat class executed constructor');
	equal(cat.inteligent, 10, 'Cat class executed parent constructor');
	ok(maroo instanceof Human, 'Human class can be instance');
	ok(noargs instanceof NoArgument, 'Class with no argument can be instanced');
	ok(withargs instanceof WithArgument, 'Class with argument can be instanced');
	equal(withargs.arg1, 'test', 'Class with argument works profer');

	// events
	cat.bind('say', function(e, voice) {
		ok(true, 'Cat fired event');
		equal(voice, 'mew~', 'Cat fired event with parameters');
	});
	cat.say();
	var handler = function(e) {
		ok(false, 'unbinded event handler');
	}
	cat.bind('say', handler);
	equal(cat.__events__['say'].length, 2, 'event handler binded');
	cat.unbind('say', handler);
	equal(cat.__events__['say'].indexOf(handler), -1, 'event handler unbinded');
	cat.say();

	// implement
	Cat.implement({
		energy: 1,
		eat: function(food) {
			this.energy += 1;
		}
	});

	equal(cat.energy, 1, 'property Implementation');
	cat.eat('fish');
	equal(cat.energy, 2, 'method Implementation');
});

test('URL', function() {
	var sUrl = 'http://juice.maroo.info/mixer?m=ui.Template#test=1';
	var url = new URL(sUrl);

	equal(url.scheme, 'http', 'URL parsed scheme');
	equal(url.domain, 'juice.maroo.info', 'URL parsed domain');
	equal(url.path, '/mixer', 'URL parsed path');
	ok(url.query.m, 'ui.Template', 'URL parsed query');
	equal(url.fragment, 'test=1', 'URL parsed fragment');

	url.query.debug = 'true';
	equal(url.query.debug, 'true', 'URL can modify query');
	url.fragment = 'test=2';
	equal(url.fragment, 'test=2', 'URL can modify fragment');
	url.path = '/juice.js';
	equal(url.path, '/juice.js', 'URL can midify path');

	equal(url.toString(),
		'http://juice.maroo.info/juice.js?m=ui.Template&debug=true#test=2',
		'URL can reconstructed to string');
});
