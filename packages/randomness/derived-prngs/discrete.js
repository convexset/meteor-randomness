/* global PackageUtilities: true */
/* global Randomness: true */
/* global defaultSeed: true */

/* global makeRandomVariable: true */

PackageUtilities.addImmutablePropertyFunction(Randomness, 'makePRNGDiscrete', function makePRNGDiscrete(p = [0.5, 0.5], seed = null) {
	if (seed === null) {
		seed = defaultSeed();
	}

	var rngU = Randomness.makePRNGUniform(seed + 11000);

	// Make CDF
	var cdf = (function() {
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
		return _cdf.map((v, idx) => ((idx === _cdf.length - 1) ? 1 : v / maxV));
	})();

	return makeRandomVariable(function randomDiscrete() {
		var u = rngU();
		for (var k = 0; k < cdf.length; k++) {
			if (u <= cdf[k]) {
				return k;
			}
		}
	}, {
		name: 'Discrete',
		parameters: {
			cdf: cdf
		},
		isNumeric: false,
		isNonNegative: false,
		isDiscrete: true,
	}, {}, {});
});