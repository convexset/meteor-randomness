/* global makeRandomVariable: true */
/* global InternalUtilities: true */

import { checkNpmVersions } from 'meteor/tmeasday:check-npm-versions';
checkNpmVersions({
	'package-utils': '^0.2.1',
	'underscore': '^1.8.3',
});
const PackageUtilities = require('package-utils');
const _ = require('underscore');

var StatisticalFunctions = {
	markovTailBound: function markovTailBound(params, a) {
		if (this.isNumeric && this.isNonNegative && !this.isMultivariate) {
			return this.mean / a;
		} else {
			return null;
		}
	},
	chebyshevUpperTailBound: function chebyshevUpperTailBound(params, x) {
		if (this.isNumeric && !this.isMultivariate) {
			var z = (x - this.mean) / Math.sqrt(this.variance);
			return Math.min(1, (z <= 0) ? Infinity : Math.pow(z, -2));
		} else {
			return null;
		}
	},
	chebyshevLowerTailBound: function chebyshevLowerTailBound(params, x) {
		if (this.isNumeric && !this.isMultivariate) {
			var z = (this.mean - x) / Math.sqrt(this.variance);
			return Math.min(1, (z <= 0) ? Infinity : Math.pow(z, -2));
		} else {
			return null;
		}
	},
	chernoffUpperTailBound: function chernoffUpperTailBound(params, x, t) {
		if (this.isNumeric && !this.isMultivariate) {
			if (t < 0) {
				throw new Meteor.Error('invalid-argument', 't must be non-negative. Selected: ' + t);
			}
			var mgf_t = this.mgf(t);
			return Math.min(1, mgf_t * Math.exp(-x * t));
		} else {
			return null;
		}
	},
	chernoffLowerTailBound: function chernoffLowerTailBound(params, x, t) {
		if (this.isNumeric && !this.isMultivariate) {
			if (t > 0) {
				throw new Meteor.Error('invalid-argument', 't must be non-positive. Selected: ' + t);
			}
			var mgf_t = this.mgf(t);
			return Math.min(1, mgf_t * Math.exp(-x * t));
		} else {
			return null;
		}
	},
	chernoffUpperTailBound_ApproxMin: function chernoffUpperTailBound_ApproxMin(params, x, t0, t1, options) {
		options = _.extend({
			numSamples: 1000,
			excludeLeftEndpoint: false,
			excludeRightEndpoint: false,
		}, options);

		var self = this;
		if (t0 < 0) {
			throw new Meteor.Error('invalid-argument', 't0 must be non-negative. Selected: ' + t0);
		}
		return InternalUtilities.approxMinimization_IntervalEnumeration(
			t => self.chernoffUpperTailBound(x, t),
			t0, t1, options
		)[1];
	},
	chernoffLowerTailBound_ApproxMin: function chernoffLowerTailBound_ApproxMin(params, x, t0, t1, options) {
		options = _.extend({
			numSamples: 1000,
			excludeLeftEndpoint: false,
			excludeRightEndpoint: false,
		}, options);

		var self = this;
		if (t1 > 0) {
			throw new Meteor.Error('invalid-argument', 't1 must be non-positive. Selected: ' + t1);
		}
		return InternalUtilities.approxMinimization_IntervalEnumeration(
			t => self.chernoffLowerTailBound(x, t),
			t0, t1, options
		)[1];
	},
};

makeRandomVariable = function makeRandomVariable(generator, info, metrics = {}, funcs = {}) {
	info = _.extend({
		description: null,
		parameters: {},
		isNumeric: true,
		isNonNegative: false,
		isDiscrete: false,
		isMultivariate: false,
	}, info);

	function notImplemented() {
		throw 'not-implemented';
	}
	metrics = _.extend({
		// signature: (params) => value
		mean: notImplemented,
		variance: notImplemented,
	}, metrics);
	funcs = _.extend({
		// signature: (params, x) => value
		pmf: notImplemented,
		pdf: notImplemented,
		cdf: notImplemented,
		mgf: notImplemented,
	}, funcs);

	var myRV = generator;
	PackageUtilities.addImmutablePropertyFunction(myRV, Symbol.iterator, function unlimitedStreamOfRandomSamples() {
		return {
			next: function nextRandomSampleInAnUnlimitedStream() {
				return {
					value: generator(),
					done: false
				};
			}
		};
	});

	_.forEach(info, function(v, name) {
		if (typeof v === "object") {
			PackageUtilities.addImmutablePropertyObject(myRV, name, v);
		} else {
			PackageUtilities.addImmutablePropertyValue(myRV, name, v);
		}
	});

	_.forEach(metrics, function(x, name) {
		if (_.isFunction(x)) {
			PackageUtilities.addPropertyGetter(myRV, name, function() {
				return x(myRV.parameters);
			});
		} else {
			PackageUtilities.addImmutablePropertyValue(myRV, name, x);
		}
	});

	_.forEach(_.extend({}, StatisticalFunctions, funcs), function(fn, name) {
		if (_.isFunction(fn)) {
			PackageUtilities.addImmutablePropertyFunction(myRV, name, function(...args) {
				return fn.apply(myRV, [myRV.parameters].concat(args));
			});
		} else {
			throw new Meteor.Error('not-a-function', name);
		}
	});

	return myRV;
};