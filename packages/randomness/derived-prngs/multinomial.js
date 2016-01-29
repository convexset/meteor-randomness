/* global PackageUtilities: true */
/* global Randomness: true */
/* global defaultSeed: true */

/* global makeRandomVariable: true */
/* global InternalUtilities: true */

PackageUtilities.addImmutablePropertyFunction(Randomness, 'makePRNGMultinomial', function makePRNGMultinomial(n = 1, p = [0.5, 0.5], seed = null) {
	if (seed === null) {
		seed = defaultSeed();
	}

	if ((n !== Math.floor(n)) || (n < 1)) {
		throw new Meteor.Error('invalid-argument', 'n = ' + n + ' not positive integer');
	}

	var rngU = Randomness.makePRNGUniform(seed + 11000);

	// Make CDF
	var pmf_cdf = InternalUtilities.makePMFAndCDFFromLikelihood(p);
	var pmf = pmf_cdf.pmf;
	var cdf = pmf_cdf.cdf;

	return makeRandomVariable(function randomMultimonial() {
		var outcome = pmf.map(() => 0);
		_.range(n).forEach(function() {
			var u = rngU();
			for (var k = 0; k < cdf.length; k++) {
				if (u <= cdf[k]) {
					outcome[k] += 1;
					break;
				}
			}
		});
		return outcome;
	}, {
		description: 'Multinomial',
		parameters: {
			n: n,
			p: pmf
		},
		isNumeric: true,
		isNonNegative: true,
		isDiscrete: true,
		isMultivariate: true,
	}, {
		mean: params => params.p.map(x => params.n * x),
		variance: params => params.p.map(x => params.n * x * (1 - x)),
	}, {
		covariance: (params, i, j) => ((i === j) ? (params.n * params.p[i] * (1 - params.p[i])) : (-params.n * params.p[i] * params.p[j])),
		pmf: function(params, x) {
			if (x.reduce((a, b) => a + b) !== params.n) {
				throw new Meteor.Error('invalid-outcome', EJSON.stringify(x));
			}
			var p_x = InternalUtilities.factorial(params.n);
			x.forEach(function(x_k, k) {
				p_x *= Math.pow(params.p[k], x_k) / InternalUtilities.factorial(x_k);
			});
			return p_x;
		},
	});
});