// BNF(-ish) notation
// Note: terminals starting with % (like %ws) are tokens (syntactic
// categories) of the lexer.
//
// main -> content
//
// content -> p
//     | h1
//
// h1 -> %hash %ws+ text
//     | %hash
//
// p -> text
//
// text -> %word %ws+ text
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
const isHash = (lexer: Lexer) => is("hash", lexer);

const isP = (lexer: Lexer) => isText(lexer);
const isText = (lexer: Lexer): boolean =>
	(isWord(lexer) && isWS(lexer.next()) && isText(lexer.next().next())) ||
	isWord(lexer);

const isH1 = (lexer: Lexer) =>
	(isHash(lexer) && isWS(lexer.next()) && isText(lexer.next().next())) ||
	isHash(lexer);

const match = (type: string, lexer: Lexer): [Node, Lexer] => {
	log(`Match "${type}"`);

	if (is(type, lexer)) {
		return [node(type, lexer.token.value), lexer.next()];
	}

	const wrong = lexer.token.type;
	throw new Error(`Syntax error, expected "${type}" got "${wrong}"`);
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

const matchH1 = (lexer: Lexer): [Node, Lexer] => {
	log(`Match "h1"`);

	const [hash, hashLexer] = match("hash", lexer);
	if (isWS(hashLexer)) {
		const [ws, wsLexer] = match("ws", hashLexer);
		const [text, textLexer] = matchText(wsLexer);
		return [node("h1", text), textLexer];
	}

	return [node("h1", hash), hashLexer];
};

const matchP = (lexer: Lexer): [Node, Lexer] => {
	log(`Match "p"`);

	const [text, textLexer] = matchText(lexer);
	return [node("p", text), textLexer];
};

const matchContent = (lexer: Lexer): [Node, Lexer] => {
	log(`Match "content"`);

	if (isP(lexer)) {
		const [p, pLexer] = matchP(lexer);
		return [node("content", p), pLexer];
	}

	if (isH1(lexer)) {
		const [h1, h1Lexer] = matchH1(lexer);
		return [node("content", h1), h1Lexer];
	}

	throw new Error(
		`Syntax error, expeced "h1" or "p", got "${lexer.token.type}"`
	);
};

const matchMain = (lexer: Lexer): [Node, Lexer] => {
	log(`Match "main"`);

	const [content, contentLexer] = matchContent(lexer);
	return [node("main", content), contentLexer];
};

const useParser = (lexer: Lexer) => ({
	parse: (): Node => {
		const [main] = matchMain(lexer.next());
		logDeep(main, "AST");
		return main;
	},
});

export default useParser;
