/* global PackageUtilities: true */
/* global Randomness: true */
/* global BayesianConjugates: true */

BayesianConjugates.inferMultinomial = function inferMultinomial(
	m = 2,
	n = 1,
	samples = [],
	priorParameters = null, // [1, 1, ..., 1]
	seed = null
) {
	if ((typeof m !== "number") || Number.isNaN(m) ||
		(!Number.isFinite(m)) || (m !== Math.floor(m)) || (m < 2) ||
		(typeof n !== "number") || Number.isNaN(n) ||
		(!Number.isFinite(n)) || (n !== Math.floor(n)) || (n < 2)) {
		throw new Meteor.Error('invalid-parameters', EJSON.stringify({
			n: n,
			m: m
		}));
	}

	if (priorParameters === null) {
		priorParameters = _.range(m).map(() => 1);
	} else {
		var priorInvalid = !_.isArray(priorParameters) ;
		if (!priorInvalid) {
			priorInvalid = priorParameters.length === m;
		}
		if (!priorInvalid) {
			priorParameters.forEach(function(a) {
				if ((typeof a !== "number") || Number.isNaN(a) ||
					(!Number.isFinite(a)) || (a <= 0)) {
					priorInvalid = true;
				}
			});
		}
		if (priorInvalid) {
			throw new Meteor.Error('invalid-prior', EJSON.stringify(priorParameters));
		}
	}

	var posteriorParameters = PackageUtilities.shallowCopy(priorParameters);
	samples.forEach(function(x, idx) {
		var sampleInvalid = !_.isArray(x);
		if (!sampleInvalid) {
			sampleInvalid = x.length !== m;
		}
		if (!sampleInvalid) {
			sampleInvalid = x.reduce((a, b) => a + b) !== n;
		}
		if (!sampleInvalid) {
			x.forEach(function(x_k) {
				if ((typeof x_k !== "number") || Number.isNaN(x_k) ||
					(!Number.isFinite(x_k)) || (x_k !== Math.floor(x_k)) ||
					(x_k < 0) || (x_k >= n)) {
					sampleInvalid = true;
				}
			});
		}
		if (sampleInvalid) {
			throw new Meteor.Error('invalid-sample', EJSON.stringify({
				idx: idx,
				x: x,
			}));
		}
		x.forEach(function(x_k, idx) {
			posteriorParameters[idx] += x_k;
		});
	});
	return {
		posteriorParameters: posteriorParameters,
		parameterSampler: Randomness.makePRNGDirichlet(posteriorParameters, seed),
		sampler: Randomness.makePRNGDirichletMultinomial(posteriorParameters, n, seed),
	};
};

/*
// Test Snippets

var rngM = Randomness.makePRNGMultinomial(15, [0.05,0.3,0.6,0.05]);
var samples = _.range(500).map(() => rngM());
var infered = Randomness.BayesianConjugates.inferMultinomial(4, 15, samples, null);
console.log('Parameters:', infered.posteriorParameters);
console.log('Mean, Variance:', infered.parameterSampler.mean, infered.parameterSampler.variance);

*/