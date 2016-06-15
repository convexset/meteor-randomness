/* global Randomness: true */

import { checkNpmVersions } from 'meteor/tmeasday:check-npm-versions';
checkNpmVersions({
  'package-utils': '^0.2.1'
});
const PackageUtilities = require('package-utils');


var gammaMemo = {};
PackageUtilities.addImmutablePropertyFunction(Randomness, 'gamma', function gamma(z, memoize = false) {
	// Implementaion of the Lanczos Approximation
	// https://en.wikipedia.org/wiki/Lanczos_approximation

	var _z = z;
	if (gammaMemo.hasOwnProperty(z)) {
		return gammaMemo[z];
	}

	var p = [
		676.5203681218851, -1259.1392167224028,
		771.32342877765313, -176.61502916214059,
		12.507343278686905, -0.13857109526572012,
		9.9843695780195716e-6, 1.5056327351493116e-7
	];

	var result;

	var i;
	if (z === 0.5) {
		result = Math.sqrt(Math.PI);
	} else if (z === -1) {
		result = -Infinity;
	} else if (z === 0) {
		result = -Infinity;
	} else if ((z > 0) && (z === Math.floor(z))) {
		// gamma(z) = (z-1)! for integer z
		result = 1;
		for (i = 2; i < z; i++) {
			result *= i;
		}
	} else if (z - 0.5 === Math.floor(z - 0.5)) {
		// gamma(z + 0.5) = SomeThing * sqrt(pi) for integer z
		var n = Math.floor(z - 0.5);
		var absN = Math.abs(n);

		var factorial_over_exponent = 1;
		for (i = 1; i <= absN; i++) {
			factorial_over_exponent *= ((absN + i) / 4);
		}

		if (n > 0) {
			result = Math.sqrt(Math.PI) * factorial_over_exponent;
		} else {
			result = Math.sqrt(Math.PI) / factorial_over_exponent;
			result *= ((absN % 2 === 1) ? -1 : 1);
		}
	} else if (z < 0.5) {
		result = Math.PI / (Math.sin(Math.PI * z) * gamma(1 - z));
	} else {
		z -= 1;
		var x = 0.99999999999980993;
		p.forEach(function(v, idx) {
			x += v / (z + idx + 1);
		});
		var t = z + p.length - 0.5;
		result = Math.sqrt(2 * Math.PI) * Math.pow(t, z + 0.5) * Math.exp(-t) * x;
	}

	if (memoize) {
		gammaMemo[_z] = result;
	}
	return result;
});

PackageUtilities.addImmutablePropertyFunction(Randomness, 'betaMV', function betaMV(alpha, memoize = false) {
	var a_0 = alpha.reduce((x, y) => x + y);
	var result = 1.0 / Randomness.gamma(a_0, memoize);
	alpha.forEach(function(a) {
		result *= Randomness.gamma(a, memoize);
	});
	return result;
});

PackageUtilities.addImmutablePropertyFunction(Randomness, 'beta', function beta(x, y, memoize = false) {
	return Randomness.betaMV([x, y], memoize);
});