Package.describe({
	name: 'convexset:randomness',
	version: '0.0.1',
	summary: 'Tools for doing stochastic modelling and statistics (with seedable PRNGs)',
	git: 'https://github.com/convexset/meteor-randomness',
	documentation: '../../README.md'
});


Package.onUse(function(api) {
	api.versionsFrom('1.2.0.2');

	api.use(
		[
			'ecmascript', 'underscore', 'check', 'ejson',
			'convexset:package-utils@0.1.9',
		]
	);
	api.use([], 'server');
	api.use([], 'client');

	api.addFiles([
		'base-prngs/alea-prng.js',
		'base-prngs/nonsense-prng.js'
	]);
	api.addFiles([
		'randomness.js',
		'make-random-variable.js',
		'special-functions.js'
	]);
	api.addFiles([
		'derived-prngs/uniform.js',
		'derived-prngs/discrete.js',
		'derived-prngs/etc.js',
		'derived-prngs/exponential.js',
		'derived-prngs/poisson.js',
		'derived-prngs/normal.js',
		'derived-prngs/gamma.js',
		'derived-prngs/beta.js',
		'derived-prngs/dirichlet.js',
	]);

	api.export('Randomness');
	api.export('makeRandomVariable');
});


Package.onTest(function(api) {
	api.use(['tinytest', 'ecmascript', 'underscore', 'ejson', ]);
	api.use('convexset:randomness');
	api.addFiles(['tests.js', ]);
	api.addFiles([], 'server');
	api.addFiles([], 'client');
});