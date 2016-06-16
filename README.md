# Randomness

This Meteor package provides tools for doing stochastic modelling and statistics.
Provides tools for generating random variates (uniform, normal, exponential, Poisson, gamma, beta, Dirichlet) and doing Bayesian statistics.

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Install](#install)
- [Random Variates](#random-variates)
  - [Some of the Usual RVs](#some-of-the-usual-rvs)
  - [Additional Random Things](#additional-random-things)
- [Additional Interfaces](#additional-interfaces)
- [Special Functions](#special-functions)
- [Bayesian Inference with Conjugate Distributions](#bayesian-inference-with-conjugate-distributions)
- [Notes](#notes)
  - [Random Variable Generation](#random-variable-generation)
  - [To Dos](#to-dos)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Install

This is available as [`convexset:randomness`](https://atmospherejs.com/convexset/randomness) on [Atmosphere](https://atmospherejs.com/). (Install with `meteor add convexset:randomness`.)

If you get an error message like:
```
WARNING: npm peer requirements not installed:
 - package-utils@^0.2.1 not installed.
          
Read more about installing npm peer dependencies:
  http://guide.meteor.com/using-packages.html#peer-npm-dependencies
```
It is because, by design, the package does not include instances of these from `npm` to avoid repetition. (In this case, `meteor npm install --save package-utils`.)

See [this](http://guide.meteor.com/using-packages.html#peer-npm-dependencies) or [this](https://atmospherejs.com/tmeasday/check-npm-versions) for more information.

Now, if you see a message like
```
WARNING: npm peer requirements not installed:
underscore@1.5.2 installed, underscore@^1.8.3 needed
```
it is because you or something you are using is using Meteor's cruddy old `underscore` package. Install a new version from `npm`. (And, of course, you may use the `npm` version in a given scope via `require("underscore")`.)


## Random Variates

Unless otherwise stated, the "make" functions below create a function that can be called with no arguments to generate a random sample from the desired distribution.

### Some of the Usual RVs

 - [Standard Uniform](https://en.wikipedia.org/wiki/Uniform_distribution_(continuous)): `Randomness.makePRNGUniform(seed = null)`
 - [Uniform](https://en.wikipedia.org/wiki/Uniform_distribution_(continuous)) on [`a`, `b`]: `Randomness.makePRNGUniform_Range(a = 0, b = 1, seed = null)`
 - [Discrete Uniform](https://en.wikipedia.org/wiki/Uniform_distribution_(discrete)) on [`a`, `b`]: `Randomness.makePRNGUniform_Range_Integer_IncludeRightEndPoint(a = 0, b = 1, seed = null)`
 - [Discrete Uniform](https://en.wikipedia.org/wiki/Uniform_distribution_(discrete)) on [`a`, `b`): `Randomness.makePRNGUniform_Range_Integer_ExcludeRightEndPoint(a = 0, b = 1, seed = null)`
 - [Bernoulli](https://en.wikipedia.org/wiki/Bernoulli_distribution) (returns `1` or `0`): `Randomness.makePRNGBernoulli(p = 0.5, seed = null)` (where `p` is the probability of getting a `1` outcome)
 - [Binomial](https://en.wikipedia.org/wiki/Binomial_distribution): `Randomness.makePRNGBinomial(p = 0.5, n = 1, seed = null)`
 - [Categorical](https://en.wikipedia.org/wiki/Categorical_distribution): `Randomness.makePRNGCategorical(p = [0.5, 0.5], seed = null)`
 - [Multinomial](https://en.wikipedia.org/wiki/Multinomial_distribution): `Randomness.makePRNGMultinomial(n = 1, p = [0.5, 0.5], seed = null)`
 - [Exponential](https://en.wikipedia.org/wiki/Exponential_distribution): `Randomness.makePRNGExponential(lambda = 1, seed = null)`
 - [Poisson](https://en.wikipedia.org/wiki/Poisson_distribution): `Randomness.makePRNGPoisson(lambda = 1, seed = null)`
 - [Normal](https://en.wikipedia.org/wiki/Normal_distribution): `Randomness.makePRNGNormal(mu = 0, sigma = 1, seed = null)`
 - [Gamma](https://en.wikipedia.org/wiki/Gamma_distribution): `Randomness.makePRNGGamma(k = 1, theta = 1, seed = null)`
 - [Beta](https://en.wikipedia.org/wiki/Beta_distribution): `Randomness.makePRNGBeta(a = 1, b = 1, seed = null)`
 - [Beta-Binomial](https://en.wikipedia.org/wiki/Beta-binomial_distribution): `Randomness.makePRNGBetaBinomial(a = 1, b = 1, n = 1, seed = null)`
 - [Dirichlet](https://en.wikipedia.org/wiki/Dirichlet_distribution): `Randomness.makePRNGDirichlet(alpha = [1, 1], seed = null)`
 - [Dirichlet-Multinomial](https://en.wikipedia.org/wiki/Dirichlet-multinomial_distribution): `Randomness.makePRNGDirichletMultinomial(alpha = [1, 1], n = 1, seed = null)`

### Additional Random Things
 - Uniformly Random Array Element: `Randomness.makePseudoRandomFromArrayGenerator(arr, seed = null)`
 - Uniformly Random Alphanumeric String: `Randomness.makePseudoRandomAlphaNumericStringGenerator(seed = null)` returns a function that can be called with a `length` argument to generate a random alpha numeric string with that length
 - Random Verb-Adjective-Noun String: `Randomness.makePseudoRandomVerbAdjNounGenerator(seed = null)`
 - Random Verb-Noun String: `Randomness.makePseudoRandomVerbNounGenerator(seed = null)`
 - Random Adjective-Noun String: `Randomness.makePseudoRandomAdjNounGenerator(seed = null)`

## Additional Interfaces

The resulting random number generators provide the following properties and more, most of which should be implemented for each random variable `rng`.

- `rng.name`: name/family of random variable
- `rng.parameters`: parameters
- `rng.isNumeric`: whether outcomes are numeric
- `rng.isNonNegative`: whether outcomes are non-negative
- `rng.isDiscrete`: whether outcomes are discrete
- `rng.isMultivariate`: whether outcomes are multivariate
- `rng.mean`: mean
- `rng.variance`: variance
- `rng.pmf`: probability mass function (typically not implemented for non-discrete RVs)
- `rng.pdf`: probability density function (typically not implemented for discrete RVs)
- `rng.cdf`: cumulative distribution function
- `rng.mgf`: moment generating function

Where applicable, the following additional tools are provided:

 - `rng.markovTailBound(a)`: [Markov's Inequality](https://en.wikipedia.org/wiki/Markov%27s_inequality) upper-bound for P(X > `a`) (requires `mean` to be implemented)
 - `rng.chebyshevUpperTailBound(x)`: [Chebyshev's Inequality](https://en.wikipedia.org/wiki/Chebyshev%27s_inequality) upper-bound for P(X > `x`) (requires `mean` and `variance` to be implemented)
 - `rng.chebyshevLowerTailBound(x)`: [Chebyshev's Inequality](https://en.wikipedia.org/wiki/Chebyshev%27s_inequality) upper-bound for P(X < `x`) (requires `mean` and `variance` to be implemented)
 - `rng.chernoffUpperTailBound(x, t)`: [Chernoff upper-bound](https://en.wikipedia.org/wiki/Chernoff_bound) for P(X > `x`) given (non-negative) parameter `t` (requires `mgf` to be implemented)
 - `rng.chernoffLowerTailBound(x, t)`: [Chernoff upper-bound](https://en.wikipedia.org/wiki/Chernoff_bound) for P(X < `x`) given (non-positive) parameter `t` (requires `mgf` to be implemented)
 - `rng.chernoffUpperTailBound_ApproxMin(x, t0, t1, options)`: [Chernoff upper-bound](https://en.wikipedia.org/wiki/Chernoff_bound) for P(X > `x`) given (non-negative) interval [`t0`, `t1`] to search over (requires `mgf` to be implemented)
 - `rng.chernoffLowerTailBound_ApproxMin(x, t0, t1, options)`: [Chernoff upper-bound](https://en.wikipedia.org/wiki/Chernoff_bound) for P(X < `x`) given (non-positive) interval [`t0`, `t1`] to search over (requires `mgf` to be implemented)

For `rng.chernoffUpperTailBound_ApproxMin` and `rng.chernoffLowerTailBound_ApproxMin`, `options` takes the form (and has the following default values):
```javascript
{
    numSamples: 1000,
    excludeLeftEndpoint: false,
    excludeRightEndpoint: false,
}
```

## Special Functions

 - [Gamma Function](https://en.wikipedia.org/wiki/Gamma_function): `Randomness.gamma(z, memoize = false)` (via the Lanczos Approximation)
 - [Beta Function](https://en.wikipedia.org/wiki/Beta_function): `Randomness.beta(x, y, memoize = false)`
 - [Multivariate Beta Function](https://en.wikipedia.org/wiki/Beta_function#Multivariate_beta_function): `Randomness.betaMV(alpha, memoize = false)`

## Bayesian Inference with Conjugate Distributions

The various tools for Bayesian inference with conjugate distributions are available under the `Randomness.BayesianConjugates` namespace. Generally, they return an object of the form:

```javascript
{
    posteriorParameters: ...,
    parameterSampler: ...,
    sampler: ...,  // available for selected distributions
}
```

 - Binomial (given n; unknown parameter p)
   * `inferBinomial(n = 1, samples = [], priorParameters = { a: 0.5, b: 0.5 }, seed = null)`
   * `sampler` (beta-binomial) available
 - Multinomial (given number of categories m; given n; unknown parameter p)
   * `inferMultinomial(m = 2, n = 1, samples = [], priorParameters = null, seed = null)`
   * Default `priorParameters` (used if `null`): `[1, 1, ..., 1]`
   * `sampler` (beta-multinomial) available
 - Poisson (unknown parameter &lambda;)
   * `inferPoisson(samples = [], priorParameters = { k: 1, theta: 1 }, seed = null)`


## Notes

### Random Variable Generation
 - The package uses the fast and seedable Alea PRNG (by Johannes Baagøe) for uniform variates.

### To Dos
 - Weighted Sums of Independent Random Variables (and bounds)
 - Bayesian inference (List of things to do cribbed from [Wikipedia](https://en.wikipedia.org/wiki/Conjugate_prior)):
   * [Hypergeometric](https://en.wikipedia.org/wiki/Hypergeometric_distribution)
   * [Geometric](https://en.wikipedia.org/wiki/Geometric_distribution)
   * [Normal](https://en.wikipedia.org/wiki/Normal_distribution) (mean, variance, mean-variance)
   * [Pareto](https://en.wikipedia.org/wiki/Pareto_distribution)
   * [Log-normal](https://en.wikipedia.org/wiki/Log-normal_distribution) (mean, precision)
   * [Exponential](https://en.wikipedia.org/wiki/Exponential_distribution)
   * [Gamma](https://en.wikipedia.org/wiki/Gamma_distribution) (shape, rate, shape-rate)