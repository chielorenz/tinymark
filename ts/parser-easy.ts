// BNF(-ish) notation
// Note: terminals starting with % (like %ws) are tokens (syntactic
// categories) of the lexer.
//
// p -> text
//
// text -> %word %ws:+ text
//     | %word

import { Lexer } from "./lexer";

export interface Node {
	readonly type: string;
	readonly value: (Node | string)[];
}

// export interface Terminal {
// 	readonly type: string;
// 	readonly value: string;
// }

export interface Match {
	readonly node: Node;
	readonly lexer: Lexer;
}

// const terminal = (lexer: Lexer): Terminal => ({
// 	type: lexer.token.type,
// 	value: lexer.token.value,
// });

const node = (type: string, ...value: (Node | string)[]): Node => ({
	type,
	value,
});

const match = (node: Node, lexer: Lexer): Match => ({ node, lexer });

const is = (type: string, lexer: Lexer) => lexer.token.type === type;
const isWS = (lexer: Lexer) => is("ws", lexer);
const isWord = (lexer: Lexer) => is("word", lexer);

const matchText = (lexer: Lexer): Match => {
	if (isWord(lexer)) {
		const word = node("word", lexer.token.value);
		if (isWS(lexer.next())) {
			const ws = node("ws", lexer.next().token.value);
			const text = matchText(lexer.next().next());
			return match(node("text", word, ws, text.node), text.lexer);
		}

		return match(node("text", word), lexer);
	}

	throw new Error("Invalid grammar, expected word");
};

const matchP = (lexer: Lexer): Match => {
	const text = matchText(lexer);
	return match(node("p", text.node), text.lexer);
};

const parse = (lexer: Lexer): Node => matchP(lexer).node;

const useParser = (lexer: Lexer) => ({
	parse: () => parse(lexer.next()),
});

export default useParser;
