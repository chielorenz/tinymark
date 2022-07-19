import lexer from "./lexer.js";
await lexer.eat("input.md");

const grammar = {
	// tinymark: ["heading", "paragraph", "newLine"],
	tinymark: `%hash %text`,
	// heading: ["h1", "h2"],
	// h1: `%hash %text`,
	// h2: ["%hash h1"],
	// paragraph: `%text`,
	// newLine: `%nl`,
};

let token = lexer.next();

for (const [nonTerminal, terminal] of Object.entries(grammar)) {
	console.log("Non terminal", nonTerminal);

	const terminals = terminal.split(" ");
	if ("%" + token.symbol === terminals[0]) {
		console.log("Match", token.symbol, token.value);
	}
}
