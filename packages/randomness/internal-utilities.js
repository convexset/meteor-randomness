/* global InternalUtilities: true */

function makePMFAndCDFFromLikelihood(p) {
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
}

function factorial(n) {
	var result = 1;
	for (var k = 1; k <= n; k++) {
		result *= k;
	}
	return result;
}

function choice(n, r) {
	return factorial(n) / (factorial(n - r) * factorial(r));
}

function factorialRatio(n, denominator) {
	var result = 1;
	for (var k = 1; k <= n; k++) {
		result *= (k / denominator);
	}
	return result;
}

function approxMinimization_IntervalEnumeration(fn, t0, t1, options) {
	options = _.extend({
		numSamples: 1000,
		excludeLeftEndpoint: false,
		excludeRightEndpoint: false,
		keepInfiniteResults: true,
	}, options);
	if (options.numSamples <= 1) {
		throw new Meteor.Error('invalid-argument', 'Choose at least 2 samples. Selected: ' + options.numSamples);
	}
	if (t0 > t1) {
		throw new Meteor.Error('invalid-argument', 'Invalid interval [t0, t1]. Selected: [' + t0 + ', ' + t1 + ']');
	}
	var _numSamples = options.numSamples + (options.excludeLeftEndpoint ? 1 : 0) + (options.excludeRightEndpoint ? 1 : 0);
	var T = _.range(_numSamples).map(idx => t0 + (idx / (_numSamples - 1)) * (t1 - t0));
	if (options.excludeLeftEndpoint) {
		T.shift();
	}
	if (options.excludeRightEndpoint) {
		T.pop();
	}
	var sol = T
		.map(t => [t, fn(t)])
		.filter(tv => !Number.isNaN(tv[1]) && (options.keepInfiniteResults || Number.isFinite(tv[1])))
		.sort((x, y) => (x[1] - y[1]))[0];
	return sol;
}

InternalUtilities = {
	makePMFAndCDFFromLikelihood: makePMFAndCDFFromLikelihood,
	factorial: factorial,
	choice: choice,
	factorialRatio: factorialRatio,
	approxMinimization_IntervalEnumeration: approxMinimization_IntervalEnumeration,
};