/* global PackageUtilities: true */
/* global Randomness: true */
/* global defaultSeed: true */

/* global makeRandomVariable: true */

PackageUtilities.addImmutablePropertyFunction(Randomness, 'makePRNGCategorical', function makePRNGCategorical(p = [0.5, 0.5], seed = null) {
	if (seed === null) {
		seed = defaultSeed();
	}

	var rngU = Randomness.makePRNGUniform(seed + 11000);

	// Make CDF
	var pmf_cdf = (function() {
		var _cdf = p.map(() => 0);
		p.forEach(function(v, idx) {
			if (idx === 0) {
				_cdf[idx] = v;
			} else {
				_cdf[idx] = v + _cdf[idx - 1];
			}
			if (v < 0) {
				throw new Meteor.Error('invalid-density-or-likelihood', 'p[' + idx + '] = ' + v + ' < 0');
			}
		});
		var maxV = _cdf[_cdf.length - 1];
		if (maxV <= 0) {
			throw new Meteor.Error('invalid-density-or-likelihood', 'Total weight non-positive');
		}
		return {
			pmf: p.map(_p => _p / maxV),
			cdf: _cdf.map((v, idx) => ((idx === _cdf.length - 1) ? 1 : v / maxV))
		};
	})();
	var pmf = pmf_cdf.pmf;
	var cdf = pmf_cdf.cdf;

	return makeRandomVariable(function randomCategorical() {
		var u = rngU();
		for (var k = 0; k < cdf.length; k++) {
			if (u <= cdf[k]) {
				return k;
			}
		}
	}, {
		description: 'Categorical',
		parameters: {
			p: pmf
		},
		isNumeric: false,
		isNonNegative: false,
		isDiscrete: true,
	}, {
		mean: params => params.p.map(x => x),
		variance: params => params.p.map(x => x * (1 - x)),
	}, {
		covariance: (params, i, j) => ((i === j) ? (params.p[i] * (1 - params.p[i])) : (-params.p[i] * params.p[j])),
		pmf: (params, i) => params.p[i],
	});
});