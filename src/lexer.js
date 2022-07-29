// Hand written simple lexer for a subset of the Markdown syntax
class Lexer {
	#buffer = "";

	// Get the next buffer cahr without removing it
	#peak() {
		return Array.from(this.#buffer)[0];
	}

	// Remove and return the next buffer char
	#pop() {
		const peak = this.#peak();
		this.#buffer = this.#buffer.substring(1);
		return peak;
	}

	// Match the next buffer char against a pattern
	// The pattern can be both a string or an array
	#match(pattern) {
		const char = this.#peak();
		if (pattern.includes(char)) {
			return this.#pop();
		}
	}

	// Match a whitespace or a tab
	#matchWhiteSpace() {
		return this.#match(["\t", " "]);
	}

	// Match a line feed or a carriage return
	#matchLineBreak() {
		return this.#match("\n\r");
	}

	// Match a hash symbol
	#matchHash() {
		return this.#match("#");
	}

	// Match a punctuation
	#matchPunctuation() {
		return this.#match(",./?;:'\"[]{}()\\|~!@$%^&*_-+=`");
	}

	// Match a digit [0..9]
	#matchDigit() {
		return this.#match("0123456789");
	}

	// Match a character [a..z][A...Z]
	#matchChar() {
		const chars = "abcdefghijklmnopqrstuvwxzyABCDEFGHIJKLMNOPQRSTUVWXYZ";
		return this.#match(chars);
	}

	// Match text (characters, digits and punctuations)
	#matchText() {
		const digit = this.#matchDigit();
		if (digit) {
			const text = this.#matchText();
			return text ? digit + text : digit;
		}

		const char = this.#matchChar();
		if (char) {
			const text = this.#matchText();
			return text ? char + text : char;
		}

		const punc = this.#matchPunctuation();
		if (punc) {
			const text = this.#matchText();
			return text ? punc + text : punc;
		}
	}

	// Get wheter all input has been consumed
	get done() {
		return this.#buffer.length === 0;
	}

	// Set the input string
	eat(string) {
		this.#buffer = string;
	}

	// Get the next token, like { symbol: "word", value: "Hello" }
	next() {
		let match;

		match = this.#matchWhiteSpace();
		if (match) {
			return { symbol: "WS", value: match };
		}

		match = this.#matchLineBreak();
		if (match) {
			return { symbol: "LB", value: match };
		}

		match = this.#matchHash();
		if (match) {
			return { symbol: "hash", value: match };
		}

		match = this.#matchText();
		if (match) {
			return { symbol: "text", value: match };
		}

		return { symbol: "other", value: this.#pop() };
	}
}

export default new Lexer();
