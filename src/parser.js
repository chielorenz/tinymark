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
//
// AST node:
// {
//   type: "h1"|"p",
//   value: [nodes]
// }

import { log } from "./utils.js";

class Parser {
	#lexer = null;

	#match(type) {
		log(`Match ${type}`);

		if (this.#lexer.peek().category === type) {
			log("✅Found:", `"${this.#lexer.peek().lexeme}"`);
			return { type, value: this.#lexer.next().lexeme };
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
		log("Match Text");

		const word = this.#matchWord();
		if (word) {
			this.#matchWhiteSpace();
			const text = this.#matchText();
			if (text) {
				return { type: "text", value: [word, text] };
			} else {
				return { type: "text", value: [word] };
			}
		}
	}

	#matchH1() {
		log("match H1");

		const hash = this.#matchHash();
		this.#matchWhiteSpace();
		const text = this.#matchText();
		if (text) {
			return { type: "h1", value: [hash, text] };
		} else {
			if (hash) {
				return { type: "h1", value: [hash] };
			}
		}
	}

	#matchP() {
		log("Match P");

		const text = this.#matchText();
		if (text) {
			return { type: "p", value: [text] };
		}
	}

	#matchContent() {
		log("Match Content");

		const p = this.#matchP();
		if (p) {
			return { type: "content", value: [p] };
		} else {
			const h1 = this.#matchH1();
			if (h1) {
				return { type: "content", value: [h1] };
			}
		}
	}

	#matchRow() {
		log("Match Row");

		this.#matchWhiteSpace();
		const content = this.#matchContent();
		if (content) {
			this.#matchWhiteSpace();
			return { type: "row", value: [content] };
		} else {
			return { type: "row", value: [] };
		}
	}

	#matchMain() {
		log("Match Main");

		const row = this.#matchRow();
		if (row) {
			const nl = this.#matchNewLine();
			if (nl) {
				const main = this.#matchMain();
				return { type: "main", value: [row, main] };
			} else {
				return { type: "main", value: [row] };
			}
		}

		return { type: "main", value: [] };
	}

	// Set the lexer
	use(lexer) {
		this.#lexer = lexer;
	}

	// Get the AST of the parsed input
	parse() {
		log("Parsing...");
		return this.#matchMain();
	}
}

export default new Parser();
