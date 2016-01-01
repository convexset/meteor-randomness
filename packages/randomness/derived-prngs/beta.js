/* global PackageUtilities: true */
/* global Randomness: true */
/* global defaultSeed: true */

/* global makeRandomVariable: true */
/* global InternalUtilities: true */

PackageUtilities.addImmutablePropertyFunction(Randomness, 'makePRNGBeta', function makePRNGBeta(a = 1, b = 1, seed = null) {
	if (seed === null) {
		seed = defaultSeed();
	}

	var parameters = {
		a: a,
		b: b,
	};

	if ((typeof a !== "number") || Number.isNaN(a) ||
		(!Number.isFinite(a)) || (a <= 0) ||
		(typeof b !== "number") || Number.isNaN(b) ||
		(!Number.isFinite(b)) || (b <= 0)) {
		throw new Meteor.Error('invalid-parameters', EJSON.stringify(parameters));
	}

	var rngGa = Randomness.makePRNGGamma(a, 1, seed + 15000);
	var rngGb = Randomness.makePRNGGamma(b, 1, seed + 15500);
	return makeRandomVariable(function randomBeta() {
		var x = rngGa();
		var y = rngGb();
		return x / (x + y);
	}, {
		name: 'Beta',
		parameters: parameters,
		isNumeric: true,
		isNonNegative: true,
		isDiscrete: false,
	}, {
		mean: params => params.a / (params.a + params.b),
		variance: params => (params.a * params.b) / (Math.pow(params.a + params.b, 2) + (params.a + params.b + 1)),
	}, {
		pdf: (params, x) => ((0 < x) && (x < 1)) ? ((Math.pow(x, params.a - 1) * Math.pow(1 - x, params.b - 1)) / Randomness.beta(params.a, params.b)) : 0,
	});
});