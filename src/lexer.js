class Lexer {
	// The string to analizy
	#buffer = "";

	// Current position on the buffer
	#index = 0;

	// Get the next char without removing it from the buffer
	#peek() {
		return Array.from(this.#buffer)[this.#index];
	}

	// Get the next char from the buffer and move forward the index
	#pop() {
		const peek = this.#peek();
		this.#index++;
		return peek;
	}

	// Match the next buffer char against a pattern
	// Theattern can be both a string or an array
	#match(pattern) {
		const char = this.#peek();
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

	// Match word (characters, digits and punctuations)
	#matchWord() {
		const digit = this.#matchDigit();
		if (digit) {
			const word = this.#matchWord();
			return word ? digit + word : digit;
		}

		const char = this.#matchChar();
		if (char) {
			const word = this.#matchWord();
			return word ? char + word : char;
		}

		const punc = this.#matchPunctuation();
		if (punc) {
			const word = this.#matchWord();
			return word ? punc + word : punc;
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
		this.#index = 0;
	}

	// Get the next token, like { category: "word", lexeme: "Hello" }
	next() {
		let match;

		match = this.#matchWhiteSpace();
		if (match) {
			return this.#token("ws", match);
		}

		match = this.#matchLineBreak();
		if (match) {
			return this.#token("lb", match);
		}

		match = this.#matchHash();
		if (match) {
			return this.#token("hash", match);
		}

		match = this.#matchWord();
		if (match) {
			return this.#token("word", match);
		}

		return this.#token("other", this.#pop());
	}

	// Get the next token without moving forward in the buffer
	peek() {
		const index = this.#index;
		const token = this.next();
		this.#index = index;
		return token;
	}
}

export default new Lexer();
