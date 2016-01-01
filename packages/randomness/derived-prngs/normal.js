/* global PackageUtilities: true */
/* global Randomness: true */
/* global defaultSeed: true */
/* global VERY_SMALL_POSITIVE_NUMBER: true */

/* global makeRandomVariable: true */

PackageUtilities.addImmutablePropertyFunction(Randomness, 'makePRNGNormal', function makePRNGNormal(mu = 0, sigma = 1, seed = null) {
	if (seed === null) {
		seed = defaultSeed();
	}

	var parameters = {
		mu: mu,
		sigma: sigma,
	};

	if ((typeof mu !== "number") || (typeof sigma !== "number") ||
		Number.isNaN(mu) || Number.isNaN(sigma) ||
		(!Number.isFinite(mu)) || (!Number.isFinite(sigma)) ||
		(sigma < 0)) {
		throw new Meteor.Error('invalid-parameters', EJSON.stringify(parameters));
	}

	var rngU1 = Randomness.makePRNGUniform(seed + 90000 + 0);
	var rngU2 = Randomness.makePRNGUniform(seed + 90000 + 0 + 500);
	var _spare = null;

	return makeRandomVariable(function randomNormal() {
		if (true || _spare === null) {
			var x = rngU1() || VERY_SMALL_POSITIVE_NUMBER; // can't be exactly 0
			var sqrtTwoLogX = Math.sqrt(-2 * Math.log(x));
			var y = rngU2();
			var cy = Math.cos(2 * Math.PI * y);
			var z = sqrtTwoLogX * cy;
			_spare = sqrtTwoLogX * Math.sin(2 * Math.PI * y);
			return mu + z * sigma;
		} else {
			var __spare = _spare;
			_spare = null;
			return __spare;
		}
	}, {
		name: 'Normal',
		parameters: parameters,
		isNumeric: true,
		isNonNegative: false,
		isDiscrete: false,
	}, {
		mean: params => params.mu,
		median: params => params.mu,
		variance: params => params.sigma * params.sigma,
		entropy: params => 0.5 * Math.log(2 * Math.PI * Math.exp(1) * params.sigma * params.sigma),
	}, {
		pdf: (params, x) => (1 / (params.sigma * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * (Math.pow(x - params.mu, 2)) / (params.sigma * params.sigma)),
		cdf: function(params, x) {
			var CDF_APPROX_INNER_RANGE = 10;
			var CDF_APPROX_OUTER_RANGE = 11;
			var CDF_APPROX_NUM_ITERATIONS = 500;


			// https://en.wikipedia.org/wiki/Normal_distribution#Numerical_approximations_for_the_normal_CDF
			var z = (x - params.mu) / params.sigma;

			var bellApproximation = Math.max(0, Math.min(1, 0.5 * (1 + Math.sign(z) * Math.sqrt(1 - Math.exp(-(2 / Math.PI) * z * z)))));

			if (z === 0) {
				return 0.5;
			} else if (Math.abs(z) > CDF_APPROX_OUTER_RANGE) {
				// Bell approximation
				return bellApproximation;
			} else {
				// Marsaglia Series Expansion
				var pdfValue = this.pdf(x);
				var factor = z;
				var zz = z * z;
				var series = z;
				for (var k = 1; k < CDF_APPROX_NUM_ITERATIONS; k++) {
					factor *= (zz / (1 + 2 * k));
					series += factor;
				}
				var marsagliaSeriesApprox = Math.max(0, Math.min(1, 0.5 + pdfValue * series));

				if (Math.abs(z) > CDF_APPROX_INNER_RANGE) {
					return marsagliaSeriesApprox * ((CDF_APPROX_OUTER_RANGE - Math.abs(z)) / (CDF_APPROX_OUTER_RANGE - CDF_APPROX_INNER_RANGE)) + bellApproximation * ((Math.abs(z) - CDF_APPROX_INNER_RANGE) / (CDF_APPROX_OUTER_RANGE - CDF_APPROX_INNER_RANGE));
				} else {
					return marsagliaSeriesApprox;
				}
			}
		},
		mgf: (params, t) => Math.exp(params.mu * t + 0.5 * params.sigma * params.sigma * t * t),
	});
});