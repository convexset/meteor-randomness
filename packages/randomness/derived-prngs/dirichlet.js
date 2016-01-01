/* global PackageUtilities: true */
/* global Randomness: true */
/* global defaultSeed: true */

/* global makeRandomVariable: true */

PackageUtilities.addImmutablePropertyFunction(Randomness, 'makePRNGDirichlet', function makePRNGDirichlet(alpha = [1, 1], seed = null) {
	if (seed === null) {
		seed = defaultSeed();
	}
	alpha.forEach(function(a, idx) {
		if (a <= 0) {
			throw new Meteor.Error('invalid-dirichlet-parameters', 'alpha[' + idx + '] = ' + a + ' <= 0');
		}
	});

	var parameters = {
		alpha: alpha
	};
	var a_0 = alpha.reduce((x, y) => x + y);

	var rngGs = alpha.map((a, idx) => Randomness.makePRNGGamma(a, 1, seed + 16000 + idx * 7));
	return makeRandomVariable(function randomDirichlet() {
		var likelihood = rngGs.map(rng => rng());
		var likelihood_total = likelihood.reduce((x, y) => x + y);
		return likelihood.map(li => li / likelihood_total);
	}, {
		name: 'Dirichlet',
		parameters: parameters,
		isNumeric: true,
		isNonNegative: true,
		isDiscrete: false,
		isMultivariate: false,
	}, {
		mean: params => params.alpha.map(a => a / a_0),
		variance: params => params.alpha.map(a => (a * (a_0 - a)) / (a_0 * a_0 * (a_0 + 1))),
	}, {
		covariance: (params, i, j) => ((i === j) ? (params.alpha[i] * (a_0 - params.alpha[i])) : (-params.alpha[i] * params.alpha[j])) / (a_0 * a_0 * (a_0 + 1)),
		pdf: (params, x) => x.map((v, idx) => Math.pow(v, params.alpha[idx] - 1)).reduce((x, y) => x * y) / Randomness.betaMV(params.alpha),
	});
});