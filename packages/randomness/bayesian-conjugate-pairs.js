/* global Randomness: true */
/* global BayesianConjugates: true */

import { checkNpmVersions } from 'meteor/tmeasday:check-npm-versions';
checkNpmVersions({
  'package-utils': '^0.2.1'
});
const PackageUtilities = require('package-utils');

BayesianConjugates = {};
PackageUtilities.addMutablePropertyObject(Randomness, 'BayesianConjugates', BayesianConjugates);