/* global InternalUtilities: true */

function factorial(n) {
	var result = 1;
	for (var k = 1; k <= n; k++) {
		result *= k;
	}
	return result;
}

function choice(n, r) {
	return factorial(n) / (factorial(n - r) * factorial(r));
}

function factorialRatio(n, denominator) {
	var result = 1;
	for (var k = 1; k <= n; k++) {
		result *= (k / denominator);
	}
	return result;
}

InternalUtilities = {
	factorial: factorial,
	choice: choice,
	factorialRatio: factorialRatio,
};