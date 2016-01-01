/* global PackageUtilities: true */
/* global Randomness: true */
/* global defaultSeed: true */

/* global makeRandomVariable: true */
/* global InternalUtilities: global */

PackageUtilities.addImmutablePropertyFunction(Randomness, 'makePRNGBernoulli', function makePRNGBernoulli(p = 0.5, seed = null) {
	if (seed === null) {
		seed = defaultSeed();
	}
	if ((p < 0) || (p > 1)) {
		throw new Meteor.Error('invalid-argument', 'p = ' + p + ' not in [0, 1]');
	}

	var parameters = {
		p: p
	};

	var rngU = Randomness.makePRNGUniform(seed + 10000);
	return makeRandomVariable(function randomBernoulli() {
		return rngU() < p ? 1 : 0;
	}, {
		name: 'Bernoulli',
		parameters: parameters,
		isNumeric: true,
		isNonNegative: false,
		isDiscrete: true,
	}, {
		mean: params => params.p,
		variance: params => params.p * (1 - params.p),
		entropy: params => -params.p * Math.log(params.p) - (1 - params.p) * Math.log(1 - params.p),
	}, {
		pmf: (params, x) => ((x === 0) || (x === 1)) ? ((x === 0) ? 1 - params.p : params.p) : 0,
		cdf: (params, x) => (x < 0) ? 0 : ((x < 1) ? 1 - params.p : 1),
		mgf: (params, t) => (1 + params.p * (Math.exp(t) - 1)),
	});
});

PackageUtilities.addImmutablePropertyFunction(Randomness, 'makePRNGBinomial', function makePRNGBernoulli(p = 0.5, n = 1, seed = null) {
	if (seed === null) {
		seed = defaultSeed();
	}
	if ((p < 0) || (p > 1)) {
		throw new Meteor.Error('invalid-argument', 'p = ' + p + ' not in [0, 1]');
	}
	if ((n !== Math.floor(n)) || (n < 1)) {
		throw new Meteor.Error('invalid-argument', 'n = ' + n + ' not positive integer');
	}

	var parameters = {
		p: p,
		n: n
	};

	var rngU = Randomness.makePRNGUniform(seed + 10500);
	return makeRandomVariable(function randomBinomial() {
		return _.range(n).map(() => rngU()).filter(u => u < p).length;
	}, {
		name: 'Binomial',
		parameters: parameters,
		isNumeric: true,
		isNonNegative: false,
		isDiscrete: true,
	}, {
		mean: params => params.n * params.p,
		variance: params => params.n * params.p * (1 - params.p),
	}, {
		pmf: (params, x) => ((x === Math.floor(x)) && (x >= 0) && (x <= params.n)) ? (InternalUtilities.choice(n, x) * Math.pow(params.p, x) * Math.pow(1 - params.p, params.n - x)) : 0,
		cdf: function(params, x) {
			var v = 0;
			for (var k = 0; k <= x; k++) {
				v += this.pmf(k);
			}
			return v;
		},
		mgf: (params, t) => Math.pow(1 + params.p * (Math.exp(t) - 1), params.n),
	});
});

/*

// test snippet

bin = Randomness.makePRNGBinomial(0.5, 20);
_.range(20+1).forEach(function(k) {
  console.log(k, bin.pmf(k), bin.cdf(k), 1-bin.cdf(k))
});

console.log('chernoffUpperTailBound_ApproxMin(15)', bin.chernoffUpperTailBound_ApproxMin(15, 0, 2));
console.log('chernoffUpperTailBound_ApproxMin(15)', bin.chernoffUpperTailBound_ApproxMin(15, 0, 10));

*/