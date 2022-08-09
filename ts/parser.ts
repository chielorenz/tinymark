// BNF(-ish) notation
// Note: terminals starting with % (like %ws) are tokens (syntactic
// categories) of the lexer.
//
// p -> text
//
// text -> %word %ws:+ text
//     | %word

import { Lexer } from "./lexer.js";
import { useLog, useLogDeep } from "./utils.js";
const log = useLog("Parser |");
const logDeep = useLogDeep("Parser |");

export interface Parser {
	parse: () => Node;
}

export interface Node {
	readonly type: string;
	readonly value: (Node | string)[];
}

const node = (type: string, ...value: (Node | string)[]): Node => ({
	type,
	value,
});

const is = (type: string, lexer: Lexer) => lexer.token.type === type;
const isWS = (lexer: Lexer) => is("ws", lexer);
const isWord = (lexer: Lexer) => is("word", lexer);

const match = (type: string, lexer: Lexer): [Node, Lexer] => {
	log(`Match "${type}"`);

	if (is(type, lexer)) {
		return [node(type, lexer.token.value), lexer.next()];
	}

	const wrong = lexer.token.type;
	throw new Error(`Invalid grammar, expected "${type}" got "${wrong}"`);
};

const matchText = (lexer: Lexer): [Node, Lexer] => {
	log(`Match "text"`);

	const [word, wordLexer] = match("word", lexer);
	if (isWS(lexer.next())) {
		const [ws, wsLexer] = match("ws", wordLexer);
		const [text, textLexer] = matchText(wsLexer);
		return [node("text", word, ws, text), textLexer];
	}

	return [node("text", word), wordLexer];
};

	log(`Match "h1"`);

const matchP = (lexer: Lexer): [Node, Lexer] => {
	log(`Match "p"`);

	const [text, textLexer] = matchText(lexer);
	return [node("p", text), textLexer];
};

	log(`Match "content"`);

const matchMain = (lexer: Lexer): [Node, Lexer] => {
	log(`Match "main"`);

};

const useParser = (lexer: Lexer) => ({
	parse: (): Node => {
		const [main] = matchMain(lexer.next());
		logDeep(main, "AST");
		return main;
	},
});

export default useParser;
