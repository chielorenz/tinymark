export interface Token {
	readonly type: string;
	readonly value: string;
}

export interface Buffer {
	readonly value: string;
	readonly match: string;
	next: () => Buffer;
	reset: () => Buffer;
	readonly done: boolean;
}

export interface Lexer {
	readonly token: Token;
	next: () => Lexer;
	peek: () => Lexer;
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

const lexer = (token: Token, buff: Buffer): Lexer => ({
	token: token,
	next: () => next(buff),
	peek: () => next(buff, true),
	done: buff.done,
});

const is = (regex: RegExp, buff: Buffer) => regex.test(buff.value);
const isDigit = (buff: Buffer) => is(/\d/, buff);
const isChar = (buff: Buffer) => is(/[a-zA-Z]/, buff);
const isWS = (buff: Buffer) => is(/[^\S\r\n]/, buff);
const isMarks = (buff: Buffer) => is(/[^a-zA-Z0-9\s]/, buff);
const isLB = (buff: Buffer) => is(/[\n\r]/, buff);
const isHash = (buff: Buffer) => is(/#/, buff);

const matchWS = (buff: Buffer) => (isWS(buff) ? buff.next() : buff);
const matchLB = (buff: Buffer) => (isLB(buff) ? buff.next() : buff);
const matchHash = (buff: Buffer) => (isHash(buff) ? buff.next() : buff);
const matchWord = (buff: Buffer): Buffer =>
	isChar(buff) || isDigit(buff) || isMarks(buff)
		? matchWord(buff.next())
		: buff;

function next(buff: Buffer, peek: boolean = false): Lexer {
	const ws = matchWS(buff);
	if (ws.match) {
		return lexer(token("ws", ws.match), peek ? buff : ws.reset());
	}

	const lb = matchLB(buff);
	if (lb.match) {
		return lexer(token("lb", lb.match), peek ? buff : lb.reset());
	}

	const hash = matchHash(buff);
	if (hash.match) {
		return lexer(token("hash", hash.match), peek ? buff : hash.reset());
	}

	const word = matchWord(buff);
	if (word.match) {
		return lexer(token("word", word.match), peek ? buff : word.reset());
	}

	return lexer(token("other", buff.value), peek ? buff : buff.next().reset());
}

const useLexer = (string: string): Lexer => lexer(token(), buffer(string));

export default useLexer;
