import { useLog } from "./utils.js";
const log = useLog("Lexer |");

export interface Lexer {
	readonly token: Token;
	next: () => Lexer;
	peek: () => Lexer;
	readonly done: boolean;
}

interface Token {
	readonly type: string;
	readonly value: string;
}

interface Buffer {
	readonly value: string;
	readonly match: string;
	next: () => Buffer;
	reset: () => Buffer;
	readonly done: boolean;
}

const token = (type = "", value = ""): Token => ({
	type,
	value,
});

const buffer = (value = "", match = ""): Buffer => ({
	value: value.slice(0, 1),
	match: match,
	next: () => buffer(value.slice(1), match.concat(value.slice(0, 1))),
	reset: () => buffer(value),
	done: value.length === 0,
});

const lexer = (token: Token, buf: Buffer): Lexer => ({
	token: token,
	next: () => next(buf),
	peek: () => next(buf, true),
	done: buf.done,
});

const is = (regex: RegExp, buf: Buffer) => regex.test(buf.value);
const isDigit = (buf: Buffer) => is(/\d/, buf);
const isChar = (buf: Buffer) => is(/[a-zA-Z]/, buf);
const isWS = (buf: Buffer) => is(/[^\S\r\n]/, buf);
const isMarks = (buf: Buffer) => is(/[^a-zA-Z0-9\s]/, buf);
const isLB = (buf: Buffer) => is(/[\n\r]/, buf);
const isHash = (buf: Buffer) => is(/#/, buf);
const isWord = (buf: Buffer) => isChar(buf) || isDigit(buf) || isMarks(buf);

const matchWS = (buf: Buffer): Buffer =>
	isWS(buf) ? matchWS(buf.next()) : buf;

const matchWord = (buf: Buffer): Buffer =>
	isWord(buf) ? matchWord(buf.next()) : buf;

function next(buf: Buffer, peek: boolean = false): Lexer {
	log(`Next on "${buf.value}"`);

	if (buf.done) {
		return lexer(token("oef", ""), buf);
	}

	if (isWS(buf)) {
		const ws = matchWS(buf.next());
		return lexer(token("ws", ws.match), peek ? buf : ws.reset());
	}

	if (isLB(buf)) {
		return lexer(token("lb", buf.value), peek ? buf : buf.next().reset());
	}

	if (isHash(buf)) {
		return lexer(token("hash", buf.value), peek ? buf : buf.next().reset());
	}

	if (isWord(buf)) {
		const word = matchWord(buf.next());
		log(`Next is "${word.match}"`);
		return lexer(token("word", word.match), peek ? buf : word.reset());
	}

	throw new Error(`Invalid character "${buf.value}"`);
}

const useLexer = (string: string): Lexer => lexer(token(), buffer(string));

export default useLexer;
