/* global PackageUtilities: true */
/* global Randomness: true */
/* global defaultSeed: true */

/* global makeRandomVariable: true */
/* global InternalUtilities: true */

PackageUtilities.addImmutablePropertyFunction(Randomness, 'makePRNGDirichletMultinomial', function makePRNGDirichletMultinomial(alpha = [1, 1], n = 1, seed = null) {
	if (seed === null) {
		seed = defaultSeed();
	}

	alpha.forEach(function(a, idx) {
		if (a <= 0) {
			throw new Meteor.Error('invalid-dirichlet-parameters', 'alpha[' + idx + '] = ' + a + ' <= 0');
		}
	});

	var parameters = {
		alpha: alpha,
		n: n
	};

	if ((typeof n !== "number") || Number.isNaN(n) ||
		(!Number.isFinite(n)) || (n !== Math.floor(n)) || (n <= 0)) {
		throw new Meteor.Error('invalid-parameters', EJSON.stringify(parameters));
	}

	var rngD = Randomness.makePRNGDirichlet(alpha, seed);
	var rngU = Randomness.makePRNGUniform(seed + 15750);
	return makeRandomVariable(function randomDirichletMultinomial() {
		var pmf = rngD();
		var cdf = InternalUtilities.makePMFAndCDFFromLikelihood(pmf).cdf;
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
		description: 'Dirichlet Multinomial',
		parameters: parameters,
		isNumeric: true,
		isNonNegative: true,
		isDiscrete: true,
	}, {}, {});
});