/* global PackageUtilities: true */
/* global Randomness: true */
/* global defaultSeed: true */

/* global makeRandomVariable: true */
/* global InternalUtilities: true */

PackageUtilities.addImmutablePropertyFunction(Randomness, 'makePRNGBetaBinomial', function makePRNGBetaBinomial(a = 1, b = 1, n = 1, seed = null) {
	if (seed === null) {
		seed = defaultSeed();
	}

	var parameters = {
		a: a,
		b: b,
		n: n
	};

	if ((typeof a !== "number") || Number.isNaN(a) ||
		(!Number.isFinite(a)) || (a <= 0) ||
		(typeof b !== "number") || Number.isNaN(b) ||
		(!Number.isFinite(b)) || (b <= 0) ||
		(typeof n !== "number") || Number.isNaN(n) ||
		(!Number.isFinite(n)) || (n !== Math.floor(n)) || (n <= 0)) {
		throw new Meteor.Error('invalid-parameters', EJSON.stringify(parameters));
	}

	var rngU = Randomness.makePRNGUniform(seed + 15250);
	var rngB = Randomness.makePRNGBeta(a, b, seed);
	return makeRandomVariable(function randomBetaBinomial() {
		var p = rngB();
		return _.range(n).map(() => rngU()).filter(u => u < p).length;
	}, {
		description: 'Beta Binomial',
		parameters: parameters,
		isNumeric: true,
		isNonNegative: false,
		isDiscrete: true,
	}, {
		mean: params => params.n * params.a / (params.a + params.b),
		variance: params => params.n * params.a * params.b * (params.a + params.b + params.n) / (Math.pow(params.a + params.b, 2) * (params.a + params.b + 1)),
	}, {
		pmf: (params, k) => InternalUtilities.choice(params.n, k) * Randomness.beta(k + params.a, params.n - k + params.b) / Randomness.beta(params.a, params.b),
	});
});