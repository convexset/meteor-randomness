/* global PackageUtilities: true */
/* global Randomness: true */

/* global defaultSeed: true */
/* global VERY_SMALL_POSITIVE_NUMBER: true */

/* global AleaPRNG: true */

Randomness = {};

PackageUtilities.addImmutablePropertyFunction(Randomness, '__AleaPRNG', AleaPRNG);

defaultSeed = function defaultSeed() {
	return (new Date()).getTime();
};

VERY_SMALL_POSITIVE_NUMBER = (function() {
	var k = 0;
	var lastSmallNumber = Math.pow(2, -k);
	var smallNumber = lastSmallNumber;
	do {
		k++;
		lastSmallNumber = smallNumber;
		smallNumber = Math.pow(2, -k);
	} while (smallNumber > 0);
	return lastSmallNumber;
})();