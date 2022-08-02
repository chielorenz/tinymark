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

import { Lexer } from "./lexer";
import { log, logDeep } from "./utils.js";

export interface Ast {
	type: string;
	value: Ast[] | string;
}

function match(type: string, lexer: Lexer): [Ast | null, Lexer] {
	log(`Matching ${type}`);

	const peek = lexer.next(true);
	if (peek.token.type === type) {
		const next = lexer.next();
		log("✅Found:", `"${next.token.value}"`);
		return [next.token, next];
	}

	return [null, lexer];
}

function matchWhiteSpace(lexer: Lexer) {
	return match("ws", lexer);
}

function matchLineBreak(lexer: Lexer) {
	return match("lb", lexer);
}

function matchHash(lexer: Lexer) {
	return match("hash", lexer);
}

function matchWord(lexer: Lexer) {
	return match("word", lexer);
}

function matchText(lexer: Lexer): [Ast | null, Lexer] {
	log("Matching text");

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
}

function matchP(lexer: Lexer): [Ast | null, Lexer] {
	log("Matching p");

	const [textAst, textLexer] = matchText(lexer);
	if (textAst) {
		return [{ type: "p", value: [textAst] }, textLexer];
	}

	return [null, lexer];
}

function matchH1(lexer: Lexer): [Ast | null, Lexer] {
	log("Matching h1");

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
}

function matchContent(lexer: Lexer): [Ast | null, Lexer] {
	log("Matching content");

	const [pAst, pLexer] = matchP(lexer);
	if (pAst) {
		return [{ type: "content", value: [pAst] }, pLexer];
	}

	const [h1Ast, h1Lexer] = matchH1(lexer);
	if (h1Ast) {
		return [{ type: "content", value: [h1Ast] }, h1Lexer];
	}

	return [null, lexer];
}

function matchRow(lexer: Lexer): [Ast | null, Lexer] {
	log("Matching row");

	const [_, wsLexer] = matchWhiteSpace(lexer);
	const [contentAst, contentLexer] = matchContent(wsLexer);
	if (contentAst) {
		const [_, wsSecondLexer] = matchWhiteSpace(contentLexer);
		return [{ type: "row", value: [contentAst] }, wsSecondLexer];
	}

	return [null, lexer];
}

function matchMain(lexer: Lexer): [Ast | null, Lexer] {
	log("Matching main");

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
}

function parse(lexer: Lexer): Ast | null {
	log("Perser:");
	const [mainAst] = matchMain(lexer);
	logDeep(mainAst, "AST:");
	return mainAst;
}

function useParser(lexer: Lexer) {
	return function () {
		return parse(lexer);
	};
}

export { useParser };
