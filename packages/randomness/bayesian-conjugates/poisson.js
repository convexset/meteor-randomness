/* global PackageUtilities: true */
/* global Randomness: true */
/* global BayesianConjugates: true */

BayesianConjugates.inferPoisson = function inferPoisson(
	samples = [],
	priorParameters = {
		k: 1,
		theta: 1
	},
	seed = null
) {
	var posteriorParameters = PackageUtilities.shallowCopy(priorParameters);
	var thetaInv = 1 / priorParameters.theta;
	samples.forEach(function(k, idx) {
		if ((typeof k !== "number") || Number.isNaN(k) ||
			(!Number.isFinite(k)) || (k !== Math.floor(k)) ||
			(k < 0)) {
			throw new Meteor.Error('invalid-sample', EJSON.stringify({
				idx: idx,
				k: k,
			}));
		}
		posteriorParameters.k += k;
		thetaInv += 1;
	});
	posteriorParameters.theta = 1 / thetaInv;

	return {
		posteriorParameters: posteriorParameters,
		parameterSampler: Randomness.makePRNGGamma(posteriorParameters.k, posteriorParameters.theta, seed),
	};
};

/*
// Test Snippets

var rngP = Randomness.makePRNGPoisson(1.5);
var samples = _.range(500).map(() => rngP());
var infered = Randomness.BayesianConjugates.inferPoisson(samples);
console.log('Parameters:', infered.posteriorParameters);
console.log('Mean, Variance:', infered.parameterSampler.mean, infered.parameterSampler.variance);
console.log('Coefficient of Variation:', Math.sqrt(infered.parameterSampler.variance) / infered.parameterSampler.mean);

*/