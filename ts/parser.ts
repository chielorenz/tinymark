// Parser for a tiny subset of the markdown syntax. It's an hand coded,
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

import { Lexer } from "./lexer";
import { useLog, useLogDeep } from "./utils.js";
const log = useLog("Parser |");
const logDeep = useLogDeep("Parser |");

export interface Ast {
	type: string;
	value: Ast[] | string;
}

const match = (type: string, lexer: Lexer): [Ast | null, Lexer] => {
	log(`Match "${type}" on`, lexer.token);

	const peek = lexer.peek();
	if (peek.token.type === type) {
		const next = lexer.next();
		log("Found", `"${next.token.value}" ✅`);
		return [next.token, next];
	}

	return [null, lexer];
};

const matchWhiteSpace = (lexer: Lexer) => match("ws", lexer);

const matchLineBreak = (lexer: Lexer) => match("lb", lexer);

const matchHash = (lexer: Lexer) => match("hash", lexer);

const matchWord = (lexer: Lexer) => match("word", lexer);

const matchText = (lexer: Lexer): [Ast | null, Lexer] => {
	log(`Match "text" on`, lexer.token);

	const [wordAst, wordLexer] = matchWord(lexer);
	if (wordAst) {
		const [wsAst, wsLexer] = matchWhiteSpace(wordLexer);
		if (wsAst) {
			const [textAst, textLexer] = matchText(wsLexer);
			if (textAst) {
				return [
					{ type: "text", value: [wordAst, wsAst, textAst] },
					textLexer,
				];
			}
		}

		return [{ type: "text", value: [wordAst] }, wsLexer];
	}

	return [null, lexer];
};

const matchP = (lexer: Lexer): [Ast | null, Lexer] => {
	log(`Match "p" on`, lexer.token);

	const [textAst, textLexer] = matchText(lexer);
	if (textAst) {
		return [{ type: "p", value: [textAst] }, textLexer];
	}

	return [null, lexer];
};

const matchH1 = (lexer: Lexer): [Ast | null, Lexer] => {
	log(`Match "h1" on`, lexer.token);

	const [hashAst, hashLexer] = matchHash(lexer);
	const [_, hashWs] = matchWhiteSpace(hashLexer);
	const [textAst, textLexer] = matchText(hashWs);
	if (textAst) {
		return [{ type: "h1", value: [textAst] }, textLexer];
	} else {
		if (hashAst) {
			return [{ type: "h1", value: "" }, hashWs];
		}
	}

	return [null, lexer];
};

const matchContent = (lexer: Lexer): [Ast | null, Lexer] => {
	log(`Match "content" on`, lexer.token);

	const [pAst, pLexer] = matchP(lexer);
	if (pAst) {
		return [{ type: "content", value: [pAst] }, pLexer];
	}

	const [h1Ast, h1Lexer] = matchH1(lexer);
	if (h1Ast) {
		return [{ type: "content", value: [h1Ast] }, h1Lexer];
	}

	return [null, lexer];
};

const matchRow = (lexer: Lexer): [Ast | null, Lexer] => {
	log(`Match "row" on`, lexer.token);

	const [_, wsLexer] = matchWhiteSpace(lexer);
	const [contentAst, contentLexer] = matchContent(wsLexer);
	if (contentAst) {
		const [_, wsSecondLexer] = matchWhiteSpace(contentLexer);
		return [{ type: "row", value: [contentAst] }, wsSecondLexer];
	}

	return [null, lexer];
};

const matchMain = (lexer: Lexer): [Ast | null, Lexer] => {
	log(`Match "main" on`, lexer.token);

	const [rowAst, rowLexer] = matchRow(lexer);
	if (rowAst) {
		const [lbAst, lbLexer] = matchLineBreak(rowLexer);
		if (lbAst) {
			const [mainAst, mainLexer] = matchMain(lbLexer);
			if (mainAst) {
				return [
					{ type: "main", value: [rowAst, lbAst, mainAst] },
					mainLexer,
				];
			}
		} else {
			return [{ type: "main", value: [rowAst] }, rowLexer];
		}
	}

	return [null, lexer];
};

const parse = (lexer: Lexer): Ast | null => {
	const [mainAst] = matchMain(lexer);
	logDeep(mainAst, "AST");
	return mainAst;
};

const useParser = (lexer: Lexer) => ({
	parse: () => parse(lexer),
});

export default useParser;
