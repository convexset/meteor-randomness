Package.describe({
	name: 'convexset:randomness',
	version: '0.0.2_3',
	summary: 'Tools for doing stochastic modelling and statistics (with seedable PRNGs)',
	git: 'https://github.com/convexset/meteor-randomness',
	documentation: '../../README.md'
});


Package.onUse(function(api) {
	api.versionsFrom('1.3.1');

	api.use(
		[
			'ecmascript', 'check', 'ejson',
			'tmeasday:check-npm-versions@0.3.1'
		]
	);
	api.use([], 'server');
	api.use([], 'client');

	api.addFiles([
		'base-prngs/alea-prng.js',
	]);
	api.addFiles([
		'randomness.js',
		'make-random-variable.js',
		'special-functions.js',
		'bayesian-conjugate-pairs.js',
		'internal-utilities.js',
	]);
	api.addFiles([
		'derived-prngs/uniform.js',
		'derived-prngs/binomial.js',
		'derived-prngs/categorical.js',
		'derived-prngs/multinomial.js',
		'derived-prngs/etc.js',
		'derived-prngs/exponential.js',
		'derived-prngs/poisson.js',
		'derived-prngs/normal.js',
		'derived-prngs/gamma.js',
		'derived-prngs/beta.js',
		'derived-prngs/beta-binomial.js',
		'derived-prngs/dirichlet.js',
		'derived-prngs/dirichlet-multinomial.js',
	]);
	api.addFiles([
		'bayesian-conjugates/binomial.js',
		'bayesian-conjugates/multinomial.js',
		'bayesian-conjugates/poisson.js',
	]);

	api.export('Randomness');
	api.export('makeRandomVariable');
});


Package.onTest(function(api) {
	api.use(['tinytest', 'ecmascript', 'ejson', ]);
	api.use('convexset:randomness');
	api.addFiles(['tests.js', ]);
	api.addFiles([], 'server');
	api.addFiles([], 'client');
});