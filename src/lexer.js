class Lexer {
	#buffer = "";

	// Get the next char without removing it from the buffer
	#peak() {
		return Array.from(this.#buffer)[0];
	}

	// Get the next char from the buffer and remove it
	#pop() {
		const peak = this.#peak();
		this.#buffer = this.#buffer.substring(1);
		return peak;
	}

	// Match the next buffer char against a pattern
	// Theattern can be both a string or an array
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

	// Return a token with the given category and lexem
	#token(category, lexeme) {
		return { category, lexeme };
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
			return this.#token("WS", match);
		}

		match = this.#matchLineBreak();
		if (match) {
			return this.#token("LB", match);
		}

		match = this.#matchHash();
		if (match) {
			return this.#token("hash", match);
		}

		match = this.#matchText();
		if (match) {
			return this.#token("text", match);
		}

		return this.#token("other", this.#pop());
	}
}

export default new Lexer();
