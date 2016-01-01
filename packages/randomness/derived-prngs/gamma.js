/* global PackageUtilities: true */
/* global Randomness: true */
/* global defaultSeed: true */
/* global VERY_SMALL_POSITIVE_NUMBER: true */

/* global makeRandomVariable: true */

PackageUtilities.addImmutablePropertyFunction(Randomness, 'makePRNGGamma', function makePRNGGamma(a = 1, theta = 1, seed = null) {
	if (seed === null) {
		seed = defaultSeed();
	}

	var parameters = {
		a: a,
		theta: theta
	};

	if ((typeof a !== "number") || Number.isNaN(a) ||
		(!Number.isFinite(a)) || (a <= 0) ||
		(typeof theta !== "number") || Number.isNaN(theta) ||
		(!Number.isFinite(theta)) || (theta <= 0)) {
		throw new Meteor.Error('invalid-parameters', EJSON.stringify(parameters));
	}

	var rngU = Randomness.makePRNGUniform(seed + 14000);
	var rngN = Randomness.makePRNGNormal(0, 1, seed + 14500);
	return makeRandomVariable(function randomGamma() {
		var gamma_a;

		var d = (a < 1 ? 1 + a : a) - 1 / 3;
		var c = 1.0 / Math.sqrt(9 * d);

		var x, x2, u, v;
		do {
			do {
				x = rngN();
				v = Math.pow(c * x + 1, 3);
			} while (v <= 0);
			u = rngU();
			x2 = Math.pow(x, 2);
		} while (
			(u >= 1 - 0.0331 * x2 * x2) &&
			(Math.log(u) >= 0.5 * x2 + d * (1 - v + Math.log(v)))
		);
		if (a < 1) {
			gamma_a = d * v * Math.exp(Math.log(rngU() || VERY_SMALL_POSITIVE_NUMBER) / a);
		} else {
			gamma_a = d * v;
		}

		return theta * gamma_a;
	}, {
		name: 'Gamma',
		parameters: parameters,
		isNumeric: true,
		isNonNegative: true,
		isDiscrete: false,
	}, {
		mean: params => params.a * params.theta,
		variance: params => params.a * params.theta * params.theta,
	}, {
		pdf: (params, x) => params.lambda * Math.exp(-params.lambda * x),
		mgf: (params, t) => (t < 1 / params.theta) ? Math.pow(1 - params.theta * t, -params.a) : undefined,
	});
});