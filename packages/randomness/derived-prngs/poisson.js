/* global PackageUtilities: true */
/* global Randomness: true */
/* global defaultSeed: true */

/* global makeRandomVariable: true */


// function factorial(n) {
// 	var result = 1;
// 	for (var k = 1; k <= n; k++) {
// 		result *= k;
// 	}
// 	return result;
// }

function factorialRatio(n, denominator) {
	var result = 1;
	for (var k = 1; k <= n; k++) {
		result *= (k / denominator);
	}
	return result;
}

PackageUtilities.addImmutablePropertyFunction(Randomness, 'makePRNGPoisson', function makePRNGPoisson(lambda = 1, seed = null) {
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

	var rngU = Randomness.makePRNGUniform(seed + 90000 + 2000);
	return makeRandomVariable(function randomPoisson() {
		// numerically stable version of the classic method
		var k = -1;
		var p = 0;
		do {
			k++;
			p += -Math.log(rngU() || VERY_SMALL_POSITIVE_NUMBER);
		} while (p < lambda);
		return k;
	}, {
		name: 'Poisson',
		parameters: parameters,
		isNumeric: true,
		isNonNegative: true,
		isDiscrete: true,
	}, {
		mean: params => params.lambda,
		variance: params => params.lambda,
	}, {
		pmf: (params, x) => ((x === Math.floor(x)) && (x >= 0)) ? (Math.exp(-params.lambda) / factorialRatio(0, params.lambda)) : 0,
		cdf: function(params, x) {
			if (x < 0) {
				return 0;
			}
			var factor = 1;
			var series = factor;
			for (var k = 1; k <= Math.floor(x); k++) {
				factor *= (params.lambda / k);
				series += factor;
			}
			return Math.exp(-params.lambda) * series;
		},
		mgf: (params, t) => Math.exp(params.lambda * (Math.exp(t) - 1)),
	});
});
