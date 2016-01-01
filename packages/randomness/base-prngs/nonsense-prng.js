/* global NonsensePRNG: true */

NonsensePRNG = function NonsensePRNG(seed) {
	// somehow this nonsense made up scheme works and has empirical parity
	// with JS's Math.random() on chi-square tests and autocorrelation from
	// 1 to 50 looks fine (similar to Math.random and Alea)
	//
	// Also, the Alea algo is much faster (like 100x, almost as fast as
	// Math.random)
	var seed_idx = _.range(5).map(x => (Math.exp(x) % (2 * Math.PI)));
	var seeds = seed_idx.map(idx => (idx + seed * (idx + 1)) % (2 * Math.PI));

	// var fivePiSq = 5 * Math.PI * Math.PI;  // For Bhaskara I's sine approximation

	var n_s = seed_idx.length;
	var twoPi = 2 * Math.PI;
	return function rng() {
		var rv = 0;

		for (var idx = 0; idx < n_s; idx++) {
			seeds[idx] = (seeds[idx] + seed_idx[idx]) % twoPi;
			rv += Math.sin(seeds[idx]);

			// Bhaskara I's sine approximation
			// https://en.wikipedia.org/wiki/Bhaskara_I%27s_sine_approximation_formula
			// Speeds things up. But...
			// Seems to have visibly negative impact on autocorrelation
			// var xx_hat = 4 * seeds[idx] * (Math.PI - seeds[idx]);
			// rv += (4 * xx_hat) / (fivePiSq - xx_hat);
		}
		return ((n_s + rv) % 1);
	};
};