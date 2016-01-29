/* global PackageUtilities: true */
/* global Randomness: true */
/* global defaultSeed: true */
/* global VERY_SMALL_POSITIVE_NUMBER: true */

/* global makeRandomVariable: true */

PackageUtilities.addImmutablePropertyFunction(Randomness, 'makePRNGGamma', function makePRNGGamma(k = 1, theta = 1, seed = null) {
	if (seed === null) {
		seed = defaultSeed();
	}

	var parameters = {
		k: k,
		theta: theta
	};

	if ((typeof k !== "number") || Number.isNaN(k) ||
		(!Number.isFinite(k)) || (k <= 0) ||
		(typeof theta !== "number") || Number.isNaN(theta) ||
		(!Number.isFinite(theta)) || (theta <= 0)) {
		throw new Meteor.Error('invalid-parameters', EJSON.stringify(parameters));
	}

	var rngU = Randomness.makePRNGUniform(seed + 14000);
	var rngN = Randomness.makePRNGNormal(0, 1, seed + 14500);
	return makeRandomVariable(function randomGamma() {
		var gamma_k;

		var d = (k < 1 ? 1 + k : k) - 1 / 3;
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
		if (k < 1) {
			gamma_k = d * v * Math.exp(Math.log(rngU() || VERY_SMALL_POSITIVE_NUMBER) / k);
		} else {
			gamma_k = d * v;
		}

		return theta * gamma_k;
	}, {
		description: 'Gamma',
		parameters: parameters,
		isNumeric: true,
		isNonNegative: true,
		isDiscrete: false,
	}, {
		mean: params => params.k * params.theta,
		variance: params => params.k * params.theta * params.theta,
	}, {
		pdf: (params, x) => params.lambda * Math.exp(-params.lambda * x),
		mgf: (params, t) => (t < 1 / params.theta) ? Math.pow(1 - params.theta * t, -params.k) : undefined,
	});
});