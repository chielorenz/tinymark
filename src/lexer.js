// Hand written simple lexer for a subset of the Markdown syntax

// Match a whitespace or a tab
function matchWhiteSpace(string) {
	const char = string[0];
	if ("\t ".includes(char)) {
		return [char, string.substring(1)];
	}
	return [null, string];
}

// Match a line feed or a carriage return
function matchLineBreak(string) {
	const char = string[0];
	if ("\n\r".includes(char)) {
		return [char, string.substring(1)];
	}
	return [null, string];
}

// Match a punctuation mark
function matchPunctuation(string) {
	const char = string[0];
	if (",./?;:'\"[]{}()\\|~!@$%^&*_-+=`".includes(char)) {
		return [char, string.substring(1)];
	}
	return [null, string];
}

// Match a digit [0..9]
function matchDigit(string) {
	const charCode = string.charCodeAt(0);
	if (charCode >= 48 && charCode <= 57) {
		return [string[0], string.substring(1)];
	}
	return [null, string];
}

// Match a character [a..z][A...Z]
function matchChar(string) {
	const charCode = string.charCodeAt(0);
	if (
		(charCode >= 65 && charCode <= 90) || // A..Z
		(charCode >= 97 && charCode <= 122) // a..z
	) {
		return [string[0], string.substring(1)];
	}
	return [null, string];
}

// Match a hash symbol
function matchHash(string) {
	if (string[0] === "#") {
		return ["#", string.substring(1)];
	}
	return [null, string];
}

// Match text (characters, digits and punctuations)
function matchText(string) {
	let char, digit, punc, text, match;

	[digit, string] = matchDigit(string);
	if (digit) {
		[text, string] = matchText(string);
		match = text ? digit + text : digit;
		return [match, string];
	}

	[char, string] = matchChar(string);
	if (char) {
		[text, string] = matchText(string);
		match = text ? char + text : char;
		return [match, string];
	}

	[punc, string] = matchPunctuation(string);
	if (punc) {
		[text, string] = matchText(string);
		match = text ? punc + text : punc;
		return [match, string];
	}
	return [null, string];
}

// The input sting
let input = "";

const lexer = {
	// Set the input string
	eat: function (string) {
		input = string;
	},
	// Get wheter all input has been consumed
	done: function () {
		return input.length === 0;
	},
	// Get the next token, like { symbol: "word", value: "Hello" }
	next: function () {
		let match = null;

		[match, input] = matchWhiteSpace(input);
		if (match) {
			return { symbol: "WS", value: match };
		}

		[match, input] = matchLineBreak(input);
		if (match) {
			return { symbol: "LB", value: match };
		}

		[match, input] = matchHash(input);
		if (match) {
			return { symbol: "hash", value: match };
		}

		[match, input] = matchText(input);
		if (match) {
			return { symbol: "text", value: match };
		}

		throw new Error(`No token found but input not empty: "${input}"`);
	},
};

lexer.eat(`# tinymark 
Hello world!`);

while (!lexer.done()) {
	console.log(lexer.next());
}
