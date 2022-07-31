// Parser for a tiny subset of the markdown syntax. It'a an hand coded,
// predictive (no backtracking), recursive descending parser.
//
// BNF(-ish) notation
// Note: terminals starting with % (like %ws) are tokens (syntactic
// categories) of the lexer.
//
// main -> row %nl main
//     | row
//
// row -> %ws* content %ws*
//     | %ws*
//
// content -> p
//     | h1
//
// p -> text
//
// h1 -> %hash %ws* text
//     | %hash
//
// text -> %word %ws:? text
//     | %word

const debug = true;
const log = (...msg) => {
	if (debug) console.log("DEBUG:", ...msg);
};

class Parser {
	#lexer = null;

	#match(type) {
		log(`match(${type})`);

		if (this.#lexer.peek().category === type) {
			log("✅Found:", `"${this.#lexer.peek().lexeme}"`);
			return [this.#lexer.next()];
		}
	}

	#matchWhiteSpace() {
		return this.#match("ws");
	}

	#matchNewLine() {
		return this.#match("lb");
	}

	#matchHash() {
		return this.#match("hash");
	}

	#matchWord() {
		return this.#match("word");
	}

	#matchText() {
		log("matchText");

		const word = this.#matchWord();
		if (word) {
			this.#matchWhiteSpace();
			const text = this.#matchText();
			if (text) {
				return [...word, ...text];
			} else {
				return [...word];
			}
		}
	}

	#matchH1() {
		log("matchH1");

		const hash = this.#matchHash();
		this.#matchWhiteSpace();
		const text = this.#matchText();
		if (text) {
			return [...hash, ...text];
		} else {
			if (hash) {
				return [...hash];
			}
		}
	}

	#matchP() {
		log("matchP");

		const text = this.#matchText();
		if (text) {
			return [...text];
		}
	}

	#matchContent() {
		log("matchContent");

		const p = this.#matchP();
		if (p) {
			return [...p];
		} else {
			const h1 = this.#matchH1();
			if (h1) {
				return [...h1];
			}
		}
	}

	#matchRow() {
		log("matchRow");

		this.#matchWhiteSpace();
		const content = this.#matchContent();
		if (content) {
			this.#matchWhiteSpace();
			return [...content];
		} else {
			return [];
		}
	}

	#matchMain() {
		log("matchMain");

		const row = this.#matchRow();
		if (row) {
			const nl = this.#matchNewLine();
			if (nl) {
				const main = this.#matchMain();
				return [...row, ...main];
			} else {
				return [...row];
			}
		}

		return [];
	}

	// Set the lexer
	use(lexer) {
		this.#lexer = lexer;
	}

	// Get the AST of the parsed input
	parse() {
		log("parse");

		return this.#matchMain();
	}
}

export default new Parser();
