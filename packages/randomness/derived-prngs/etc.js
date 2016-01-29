/* global PackageUtilities: true */
/* global Randomness: true */
/* global defaultSeed: true */

/* global makeRandomVariable: true */

PackageUtilities.addImmutablePropertyFunction(Randomness, 'makePseudoRandomFromArrayGenerator', function makePseudoRandomFromArrayGenerator(arr, seed = null) {
	if (seed === null) {
		seed = defaultSeed();
	}

	var _arr = PackageUtilities.shallowCopy(arr);
	var rng = Randomness.makePRNGUniform_Range_Integer_ExcludeRightEndPoint(0, _arr.length, seed + 40000);
	return function randomArrayElement() {
		return _arr[rng()];
	};
});

var lowercaseAlphabets = _.range('a'.charCodeAt(0), 'z'.charCodeAt(0) + 1).map(cc => String.fromCharCode(cc));
var numericCharacters = _.range('0'.charCodeAt(0), '9'.charCodeAt(0) + 1).map(cc => String.fromCharCode(cc));
var uppercaseAlphabets = lowercaseAlphabets.map(x => x.toUpperCase());

PackageUtilities.addImmutablePropertyArray(Randomness, 'LOWER_CASE_ALPHABETIC_CHARACTERS', lowercaseAlphabets);
PackageUtilities.addImmutablePropertyArray(Randomness, 'UPPER_CASE_ALPHABETIC_CHARACTERS', uppercaseAlphabets);
PackageUtilities.addImmutablePropertyArray(Randomness, 'NUMERIC_CHARACTERS', numericCharacters);
PackageUtilities.addImmutablePropertyArray(Randomness, 'ALPHA_NUMERIC_CHARACTERS', lowercaseAlphabets.concat(uppercaseAlphabets, numericCharacters));

var shortVerbs = ["add", "allow", "ask", "be", "begin", "bring", "build", "buy", "call", "can", "come", "could", "cut", "die", "do", "fall", "feel", "find", "get", "give", "go", "grow", "have", "hear", "help", "hold", "keep", "kill", "know", "lead", "learn", "leave", "let", "like", "live", "look", "lose", "love", "make", "may", "mean", "meet", "might", "move", "must", "need", "offer", "open", "pay", "play", "put", "reach", "read", "run", "say", "see", "seem", "send", "serve", "set", "show", "sit", "speak", "spend", "stand", "start", "stay", "stop", "take", "talk", "tell", "think", "try", "turn", "use", "wait", "walk", "want", "watch", "will", "win", "work", "would", "write", ];
var shortAdjectives = ["able", "bad", "best", "better", "big", "black", "blue", "clear", "close", "cold", "common", "dark", "dead", "early", "easy", "entire", "final", "fine", "free", "full", "good", "great", "green", "happy", "hard", "high", "hot", "huge", "human", "large", "late", "left", "legal", "likely", "little", "local", "long", "low", "main", "major", "new", "nice", "old", "only", "open", "past", "poor", "public", "ready", "real", "recent", "red", "right", "short", "simple", "single", "small", "social", "strong", "sure", "ther", "true", "white", "whole", "wrong", "young", ];
var shortNouns = ["air", "area", "art", "back", "body", "book", "car", "case", "child", "city", "day", "door", "end", "eye", "face", "fact", "force", "game", "girl", "group", "guy", "hand", "head", "home", "hour", "house", "idea", "issue", "job", "kid", "kind", "law", "level", "life", "line", "lot", "man", "money", "month", "name", "night", "part", "party", "place", "point", "power", "right", "room", "side", "state", "story", "study", "team", "thing", "time", "war", "water", "way", "week", "woman", "word", "work", "world", "year", ];

function toProperCase(s) {
	if (s.length === 0) {
		return '';
	} else {
		return s[0].toUpperCase() + Array.prototype.map.call(s, x => x).splice(1).join('');
	}
}

PackageUtilities.addImmutablePropertyArray(Randomness, 'SHORT_VERBS', shortVerbs.map(toProperCase));
PackageUtilities.addImmutablePropertyArray(Randomness, 'SHORT_ADJECTIVES', shortAdjectives.map(toProperCase));
PackageUtilities.addImmutablePropertyArray(Randomness, 'SHORT_NOUNS', shortNouns.map(toProperCase));

PackageUtilities.addImmutablePropertyFunction(Randomness, 'makePseudoRandomAlphaNumericStringGenerator', function makePseudoRandomAlphaNumericStringGenerator(seed = null) {
	if (seed === null) {
		seed = defaultSeed();
	}

	var rng = Randomness.makePseudoRandomFromArrayGenerator(Randomness.ALPHA_NUMERIC_CHARACTERS, seed + 50000);
	return makeRandomVariable(function randomAlphaNumericString(length = 0) {
		return _.range(length).map(() => rng()).join('');
	}, {
		description: '(n) => Random Alphanumeric String of Length n',
		parameters: {},
		isNumeric: false,
		isNonNegative: false,
		isDiscrete: true,
	});
});

PackageUtilities.addImmutablePropertyFunction(Randomness, 'makePseudoRandomVerbAdjNounGenerator', function makePseudoRandomVerbAdjNounGenerator(seed = null) {
	if (seed === null) {
		seed = defaultSeed();
	}

	var rngV = Randomness.makePseudoRandomFromArrayGenerator(Randomness.SHORT_VERBS, seed + 60000 + 1);
	var rngA = Randomness.makePseudoRandomFromArrayGenerator(Randomness.SHORT_ADJECTIVES, seed + 60000 + 10);
	var rngN = Randomness.makePseudoRandomFromArrayGenerator(Randomness.SHORT_NOUNS, seed + 60000 + 100);
	return makeRandomVariable(function randomVerbAdjNoun() {
		return rngV() + rngA() + rngN();
	}, {
		description: 'Random Verb-Adjective-Noun',
		parameters: {},
		isNumeric: false,
		isNonNegative: false,
		isDiscrete: true,
	});
});

PackageUtilities.addImmutablePropertyFunction(Randomness, 'makePseudoRandomVerbNounGenerator', function makePseudoRandomVerbNounGenerator(seed = null) {
	if (seed === null) {
		seed = defaultSeed();
	}

	var rngV = Randomness.makePseudoRandomFromArrayGenerator(Randomness.SHORT_VERBS, seed + 70000 + 2);
	var rngN = Randomness.makePseudoRandomFromArrayGenerator(Randomness.SHORT_NOUNS, seed + 70000 + 200);
	return makeRandomVariable(function randomVerbNoun() {
		return rngV() + rngN();
	}, {
		description: 'Random Verb-Noun',
		parameters: {},
		isNumeric: false,
		isNonNegative: false,
		isDiscrete: true,
	});
});

PackageUtilities.addImmutablePropertyFunction(Randomness, 'makePseudoRandomAdjNounGenerator', function makePseudoRandomAdjNounGenerator(seed = null) {
	if (seed === null) {
		seed = defaultSeed();
	}

	var rngA = Randomness.makePseudoRandomFromArrayGenerator(Randomness.SHORT_ADJECTIVES, seed + 80000 + 30);
	var rngN = Randomness.makePseudoRandomFromArrayGenerator(Randomness.SHORT_NOUNS, seed + 80000 + 300);
	return makeRandomVariable(function randomAdjNoun() {
		return rngA() + rngN();
	}, {
		description: 'Random Adjective-Noun',
		parameters: {},
		isNumeric: false,
		isNonNegative: false,
		isDiscrete: true,
	});
});