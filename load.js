/* global Randomness: true */
/* global __meteor_runtime_config__: true */

_.forEach(__meteor_runtime_config__, function(v, k) {
	console.log(k + ':', v);
});

function makeSection(name, fn, options) {
	console.log('************************************************************');
	while (name.length < 50) {
		name = ' ' + name;
		if (name.length < 50) {
			name += ' ';
		}
	}
	console.log('*****' + name + '*****');
	console.log('************************************************************');
	console.log('Options:');
	_.forEach(options, function(v, k) {
		console.log('\t' + k + ':', v);
	});
	console.log('************************************************************');
	fn(options);
	console.log('************************************************************');
	console.log('');
	console.log('');
}

makeSection('Bayesian Inference: Binomial', function({
	p, num_samples
}) {
	var rngB = Randomness.makePRNGBernoulli(p);
	var samples = _.range(num_samples).map(() => rngB());
	var infered = Randomness.BayesianConjugates.inferBinomial(1, samples);
	console.log('Posterior Parameters:', infered.posteriorParameters);
	console.log('Posterior Mean:', infered.parameterSampler.mean);
	console.log('Posterior Variance:', infered.parameterSampler.variance);
	console.log('Coefficient of Variation:', Math.sqrt(infered.parameterSampler.variance) / infered.parameterSampler.mean);
}, {
	p: 0.9,
	num_samples: 1000,
});

makeSection('Bayesian Inference: Multinomial', function({
	alpha, n, num_samples
}) {
	var rngM = Randomness.makePRNGMultinomial(n, alpha);
	var samples = _.range(num_samples).map(() => rngM());
	var infered = Randomness.BayesianConjugates.inferMultinomial(alpha.length, n, samples, null);
	console.log('Posterior Parameters:', infered.posteriorParameters);
	console.log('Posterior Mean:', infered.parameterSampler.mean);
	console.log('Posterior Variance:', infered.parameterSampler.variance);
}, {
	alpha: [0.05, 0.3, 0.6, 0.05],
	n: 15,
	num_samples: 1000,
});

makeSection('Bayesian Inference: Poisson', function({
	lambda, num_samples
}) {
	var rngP = Randomness.makePRNGPoisson(lambda);
	var samples = _.range(num_samples).map(() => rngP());
	var infered = Randomness.BayesianConjugates.inferPoisson(samples);
	console.log('Posterior Parameters:', infered.posteriorParameters);
	console.log('Posterior Mean:', infered.parameterSampler.mean);
	console.log('Posterior Variance:', infered.parameterSampler.variance);
	console.log('Coefficient of Variation:', Math.sqrt(infered.parameterSampler.variance) / infered.parameterSampler.mean);
}, {
	lambda: 1.5,
	num_samples: 1000,
});