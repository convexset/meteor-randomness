/* global InternalUtilities: true */

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
	factorial: factorial,
	choice: choice,
	factorialRatio: factorialRatio,
	approxMinimization_IntervalEnumeration: approxMinimization_IntervalEnumeration,
};