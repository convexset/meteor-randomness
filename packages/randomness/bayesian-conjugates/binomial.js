/* global PackageUtilities: true */
/* global Randomness: true */
/* global BayesianConjugates: true */

BayesianConjugates.inferBinomial = function inferBinomial(
	n = 1,
	samples = [],
	priorParameters = {
		a: 0.5,
		b: 0.5
	},
	seed = null
) {
	if ((typeof n !== "number") || Number.isNaN(n) ||
		(!Number.isFinite(n)) || (n !== Math.floor(n)) || (n <= 0)) {
		throw new Meteor.Error('invalid-parameters', EJSON.stringify({
			n: n
		}));
	}

	var posteriorParameters = PackageUtilities.shallowCopy(priorParameters);
	samples.forEach(function(k, idx) {
		if ((typeof k !== "number") || Number.isNaN(k) ||
			(!Number.isFinite(k)) || (k !== Math.floor(k)) ||
			(k < 0) || (k > n)) {
			throw new Meteor.Error('invalid-sample', EJSON.stringify({
				idx: idx,
				k: k,
			}));
		}
		posteriorParameters.a += k;
		posteriorParameters.b += n - k;
	});
	return {
		posteriorParameters: posteriorParameters,
		parameterSampler: Randomness.makePRNGBeta(posteriorParameters.a, posteriorParameters.b, seed),
		sampler: Randomness.makePRNGBetaBinomial(posteriorParameters.a, posteriorParameters.b, 1, seed),
	};
};

/*
// Test Snippets

var rngB = Randomness.makePRNGBernoulli(0.95);
var samples = _.range(500).map(() => rngB());
var infered = Randomness.BayesianConjugates.inferBinomial(1, samples);
console.log('Parameters:', infered.posteriorParameters);
console.log('Mean, Variance:', infered.parameterSampler.mean, infered.parameterSampler.variance);
console.log('Coefficient of Variation:', Math.sqrt(infered.parameterSampler.variance) / infered.parameterSampler.mean);

*/