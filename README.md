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
- [Notes](#notes)
  - [Random Variable Generation](#random-variable-generation)
  - [To Dos](#to-dos)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Install

This is available as [`convexset:randomness`](https://atmospherejs.com/convexset/randomness) on [Atmosphere](https://atmospherejs.com/). (Install with `meteor add convexset:randomness`.)

## Random Variates

Unless otherwise stated, the "make" functions below create a function that can be called with no arguments to generate a random sample from the desired distribution.

### Some of the Usual RVs

 - Standard Uniform: `Randomness.makePRNGUniform(seed = null)`
 - Uniform on [`a`, `b`]: `Randomness.makePRNGUniform_Range(a = 0, b = 1, seed = null)`
 - Discrete Uniform on [`a`, `b`]: `Randomness.makePRNGUniform_Range_Integer_IncludeRightEndPoint(a = 0, b = 1, seed = null)`
 - Discrete Uniform on [`a`, `b`): `Randomness.makePRNGUniform_Range_Integer_ExcludeRightEndPoint(a = 0, b = 1, seed = null)`
 - Bernoulli (returns `1` or `0`): `Randomness.makePRNGBernoulli(p = 0.5, seed = null)` (where `p` is the probability of getting a `1` outcome)
 - Binomial: `Randomness.makePRNGBinomial(p = 0.5, n = 1, seed = null)`
 - Discrete: `Randomness.makePRNGDiscrete(p = [0.5, 0.5], seed = null)`
 - Exponential: `Randomness.makePRNGExponential(lambda = 1, seed = null)`
 - Poisson: `Randomness.makePRNGPoisson(lambda = 1, seed = null)`
 - Normal: `Randomness.makePRNGNormal(mu = 0, sigma = 1, seed = null)`
 - Gamma: `Randomness.makePRNGGamma(a = 1, theta = 1, seed = null)`
 - Beta: `Randomness.makePRNGBeta(a = 1, b = 1, seed = null)`
 - Dirichlet: `Randomness.makePRNGDirichlet(alpha = [1, 1], seed = null)`

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

 - `rng.markovTailBound(a)`: Markov Inequality upper-bound for P(X > `a`)
 - `rng.chebyshevUpperTailBound(x)`: Chebyshev Inequality upper-bound for P(X > `x`)
 - `rng.chebyshevLowerTailBound(x)`: Chebyshev Inequality upper-bound for P(X < `x`)
 - `rng.chernoffUpperTailBound(x, t)`: Chernoff Inequality upper-bound for P(X > `x`) given (non-negative) parameter `t`
 - `rng.chernoffLowerTailBound(x, t)`: Chernoff Inequality upper-bound for P(X < `x`) given (non-positive) parameter `t`
 - `rng.chernoffUpperTailBound_ApproxMin(x, t0, t1, options)`: Chernoff Inequality upper-bound for P(X > `x`) given (non-negative) interval [`t0`, `t1`] to search over
 - `rng.chernoffLowerTailBound_ApproxMin(x, t0, t1, options)`: Chernoff Inequality upper-bound for P(X < `x`) given (non-positive) interval [`t0`, `t1`] to search over

For `rng.chernoffUpperTailBound_ApproxMin` and `rng.chernoffLowerTailBound_ApproxMin`, `options` takes the form (and has the following default values):
```javascript
{
    numSamples: 1000,
    excludeLeftEndpoint: false,
    excludeRightEndpoint: false,
}
```

## Special Functions

 - Gamma Function: `Randomness.gamma(z, memoize = false)` (via the Lanczos Approximation)
 - Beta Function: `Randomness.beta(x, y, memoize = false)`
 - Multivariate Beta Function: `Randomness.betaMV(alpha, memoize = false)`

## Notes

### Random Variable Generation
 - The package uses the fast and seedable Alea PRNG (by Johannes Baagøe) for uniform variates.

### To Dos
 - Independent Weighted Sums of Random Variables (and bounds)
 - Bayesian inference