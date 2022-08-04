import { useLog } from "./utils.js";
const log = useLog("Lexer |");

export interface Lexer {
	token: Token;
	next: () => Lexer;
	peek: () => Lexer;
	done: boolean;
}

export interface Buffer {
	raw: string;
	current: string;
	next: () => Buffer;
	done: boolean;
}

export interface Token {
	type: string;
	value: string;
}

export interface Match {
	value: string;
	buff: Buffer;
}

const MARKS = ",./?;:'\"[]{}()\\|~!@$%^&*_-+=`";
const CHARS = "abcdefghijklmnopqrstuvwxzyABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const DIGITS = "0123456789";
const WS = "\t ";
const LB = "\n\r";
const HASH = "#";

const createToken = (type: string = "", value: string = ""): Token => ({
	type,
	value,
});

const createBuffer = (raw: string = ""): Buffer => ({
	raw,
	current: raw.slice(0, 1),
	next: () => createBuffer(raw.slice(1)),
	done: raw.length === 0,
});

const createLexer = (token: Token, buff: Buffer): Lexer => ({
	token,
	next: () => nextToken(buff),
	peek: () => nextToken(buff, true),
	done: buff.done,
});

const createMatch = (value: string, buff: Buffer): Match => ({ value, buff });

const matchPattern = (patter: string, buff: Buffer): Match => {
	log(`Match pattern "${patter}" on "${buff.current}"`);

	const char = buff.current;
	return patter.includes(char)
		? createMatch(char, buff.next())
		: createMatch("", buff);
};

const matchWhiteSpace = (buff: Buffer) => matchPattern(WS, buff);
const matchLineBreak = (buff: Buffer) => matchPattern(LB, buff);
const matchHash = (buff: Buffer) => matchPattern(HASH, buff);
const matchDigit = (buff: Buffer) => matchPattern(DIGITS, buff);
const matchChar = (buff: Buffer) => matchPattern(CHARS, buff);
const matchMarks = (buff: Buffer) => matchPattern(MARKS, buff);

const matchWord = (buff: Buffer): Match => {
	const digit = matchDigit(buff);
	if (digit.value) {
		const wordMatch = matchWord(digit.buff);
		const wordValue = digit.value.concat(wordMatch.value);
		return createMatch(wordValue, wordMatch.buff);
	}

	const char = matchChar(buff);
	if (char.value) {
		const wordMatch = matchWord(char.buff);
		const charValue = char.value.concat(wordMatch.value);
		return createMatch(charValue, wordMatch.buff);
	}

	const mark = matchMarks(buff);
	if (mark.value) {
		const wordMatch = matchWord(mark.buff);
		const puncValue = mark.value.concat(wordMatch.value);
		return createMatch(puncValue, wordMatch.buff);
	}

	return createMatch("", buff);
};

function nextToken(buff: Buffer, peek: boolean = false) {
	log(`Get next token on "${buff.current}" (peek = ${peek})`);

	const ws = matchWhiteSpace(buff);
	if (ws.value) {
		const wsBuff = peek ? buff : ws.buff;
		return createLexer(createToken("ws", ws.value), wsBuff);
	}

	const lb = matchLineBreak(buff);
	if (lb.value) {
		const lbBuff = peek ? buff : lb.buff;
		return createLexer(createToken("lb", lb.value), lbBuff);
	}

	const hash = matchHash(buff);
	if (hash.value) {
		const hashBuff = peek ? buff : hash.buff;
		return createLexer(createToken("hash", hash.value), hashBuff);
	}

	const word = matchWord(buff);
	if (word.value) {
		const wordBuff = peek ? buff : word.buff;
		return createLexer(createToken("word", word.value), wordBuff);
	}

	return createLexer(
		createToken("other", buff.current),
		peek ? buff : buff.next()
	);
}

const useLexer = (value: string) =>
	createLexer(createToken(), createBuffer(value));

export default useLexer;
