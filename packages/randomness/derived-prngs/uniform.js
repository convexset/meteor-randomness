/* global PackageUtilities: true */
/* global Randomness: true */
/* global defaultSeed: true */

/* global makeRandomVariable: true */

PackageUtilities.addImmutablePropertyFunction(Randomness, 'makePRNGUniform', function makePRNGUniform(seed = null) {
	if (seed === null) {
		seed = defaultSeed();
	}

	if (Number.isNaN(Number(seed))) {
		seed = defaultSeed();
	} else {
		seed = Number(seed);
	}

	return makeRandomVariable(Randomness.__AleaPRNG(seed), {
		distribution: 'Uniform',
		parameters: {
			a: 0,
			b: 1
		},
		isNumeric: true,
		isNonNegative: true,
		isDiscrete: false,
	}, {
		mean: 0.5,
		median: 0.5,
		variance: 1 / 12,
		entropy: 0,
	}, {
		pdf: (params, x) => ((0 <= x) && (x <= 1)) ? 1 : 0,
		cdf: (params, x) => (x <= 0) ? 0 : ((x <= 1) ? x : 1),
		mgf: (params, t) => (t === 0) ? 1 : ((Math.exp(t) - 1) / t),
	});
});

PackageUtilities.addImmutablePropertyFunction(Randomness, 'makePRNGUniform_Range', function makePRNGUniform_Range(a = 0, b = 1, seed = null) {
	if (seed === null) {
		seed = defaultSeed();
	}

	var parameters = {
		a: a,
		b: b,
	};

	if ((typeof a !== "number") || (typeof b !== "number") || (b <= a)) {
		throw new Meteor.Error('invalid-parameters', EJSON.stringify(parameters));
	}

	var rng = Randomness.makePRNGUniform(seed + 1000);
	return makeRandomVariable(function rng_range() {
		return a + rng() * (b - a);
	}, {
		description: 'Uniform',
		parameters: parameters,
		isNumeric: true,
		isNonNegative: a >= 0,
		isDiscrete: false,
	}, {
		mean: params => 0.5 * (params.a + params.b),
		median: params => 0.5 * (params.a + params.b),
		variance: params => Math.pow(params.b - params.a, 2) / 12,
		entropy: params => Math.log(params.b - params.a),
	}, {
		pdf: (params, x) => ((params.a <= x) && (x <= params.b)) ? 1 / (params.b - params.a) : 0,
		cdf: (params, x) => (x <= params.a) ? 0 : ((x <= params.b) ? ((x - params.a) / (params.b - params.a)) : 1),
		mgf: (params, t) => (t === 0) ? 1 : ((Math.exp(t * params.b) - Math.exp(t * params.a)) / (t * (params.b - params.a))),
	});
});

PackageUtilities.addImmutablePropertyFunction(Randomness, 'makePRNGUniform_Range_Integer_IncludeRightEndPoint', function makePRNGUniform_Range_Integer_IncludeRightEndPoint(a = 0, b = 1, seed = null) {
	if (seed === null) {
		seed = defaultSeed();
	}

	var parameters = {
		a: a,
		b: b,
	};

	if ((typeof a !== "number") || (typeof b !== "number") ||
		(a !== Math.floor(a)) || (b !== Math.floor(b)) ||
		(b <= a)) {
		throw new Meteor.Error('invalid-parameters', EJSON.stringify(parameters));
	}

	var rng = Randomness.makePRNGUniform_Range(a, b + 1, seed + 2000);
	return makeRandomVariable(function rng_range_includeRightLimit() {
		return Math.floor(rng());
	}, {
		description: 'Discrete Uniform',
		parameters: parameters,
		isNumeric: true,
		isNonNegative: a >= 0,
		isDiscrete: true,
	}, {
		mean: params => 0.5 * (params.a + params.b),
		median: params => 0.5 * (params.a + params.b),
		variance: params => (Math.pow(params.b - params.a + 1, 2) - 1) / 12,
		entropy: params => Math.log(1 + params.b - params.a),
	}, {
		pmf: (params, x) => ((x === Math.floor(x)) && (params.a <= x) && (x <= params.b)) ? 1 / (1 + params.b - params.a) : 0,
		cdf: (params, x) => (x < params.a) ? 0 : ((x <= params.b) ? ((Math.floor(x) - params.a + 1) / (1 + params.b - params.a)) : 1),
		mgf: (params, t) => (t === 0) ? 1 : ((Math.exp(t * params.a) - Math.exp(t * (params.b + 1))) / ((1 - Math.exp(t)) * (1 + params.b - params.a))),
	});
});

PackageUtilities.addImmutablePropertyFunction(Randomness, 'makePRNGUniform_Range_Integer_ExcludeRightEndPoint', function makePRNGUniform_Range_Integer_ExcludeRightEndPoint(a = 0, b = 1, seed = null) {
	if (seed === null) {
		seed = defaultSeed();
	}

	if ((typeof a !== "number") || (typeof b !== "number") ||
		(a !== Math.floor(a)) || (b !== Math.floor(b)) ||
		(b - 1 <= a)) {
		throw new Meteor.Error('invalid-parameters', {
			a: a,
			b: b
		});
	}

	return Randomness.makePRNGUniform_Range_Integer_IncludeRightEndPoint(a, b - 1, seed + 1000);
});