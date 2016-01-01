/* global PackageUtilities: true */
/* global Randomness: true */
/* global defaultSeed: true */
/* global VERY_SMALL_POSITIVE_NUMBER: true */

/* global makeRandomVariable: true */

PackageUtilities.addImmutablePropertyFunction(Randomness, 'makePRNGExponential', function makePRNGExponential(lambda = 1, seed = null) {
	if (seed === null) {
		seed = defaultSeed();
	}

	var parameters = {
		lambda: lambda
	};

	if ((typeof lambda !== "number") || Number.isNaN(lambda) ||
		(!Number.isFinite(lambda)) || (lambda <= 0)) {
		throw new Meteor.Error('invalid-parameters', EJSON.stringify(parameters));
	}

	var rngU = Randomness.makePRNGUniform(seed + 90000 + 1000);
	return makeRandomVariable(function randomExponential() {
		var x = rngU() || VERY_SMALL_POSITIVE_NUMBER; // can't be exactly 0
		return -(1 / lambda) * Math.log(x);
	}, {
		name: 'Exponential',
		parameters: parameters,
		isNumeric: true,
		isNonNegative: false,
		isDiscrete: false,
	}, {
		mean: params => 1 / params.lambda,
		median: params => Math.log(2) / params.lambda,
		variance: params => Math.pow(params.lambda, -2),
		entropy: params => 1 - Math.log(params.lambda),
	}, {
		pdf: (params, x) => params.lambda * Math.exp(-params.lambda * x),
		cdf: (params, x) => 1 - Math.exp(-params.lambda * x),
		mgf: (params, t) => (t >= params.lambda) ? undefined : (params.lambda / (params.lambda - t)),
	});
});