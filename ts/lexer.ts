export interface Lexer {
	token: { type: string; value: string };
	next: (peek?: boolean) => Lexer;
	done: boolean;
}

function token(type: string, value: string, buff: string, index: number) {
	return {
		token: { type, value },
		next: (peek = false) => next(buff, index, peek),
		done: index >= buff.length,
	};
}

function match(patter: string, buff: string, index: number): [string, number] {
	const char = buff[index];

	if (patter.includes(char)) {
		return [char, index + 1];
	}

	return ["", index];
}

function matchWhiteSpace(buff: string, index: number): [string, number] {
	return match("\t ", buff, index);
}

function matchLineBreak(buff: string, index: number): [string, number] {
	return match("\n\r", buff, index);
}

function matchHash(buff: string, index: number): [string, number] {
	return match("#", buff, index);
}

function matchDigit(buff: string, index: number): [string, number] {
	return match("0123456789", buff, index);
}

function matchChar(buff: string, index: number): [string, number] {
	const chars = "abcdefghijklmnopqrstuvwxzyABCDEFGHIJKLMNOPQRSTUVWXYZ";
	return match(chars, buff, index);
}

function matchPunctuation(buff: string, index: number): [string, number] {
	return match(",./?;:'\"[]{}()\\|~!@$%^&*_-+=`", buff, index);
}

function matchWord(buff: string, index: number): [string, number] {
	const [digit, digitIndex] = matchDigit(buff, index);
	if (digit) {
		const [word, wordIndex] = matchWord(buff, digitIndex);
		return [digit.concat(word), wordIndex];
	}

	const [char, charIndex] = matchChar(buff, index);
	if (char) {
		const [word, wordIndex] = matchWord(buff, charIndex);
		return [char.concat(word), wordIndex];
	}

	const [punc, puncIndex] = matchPunctuation(buff, index);
	if (punc) {
		const [word, wordIndex] = matchWord(buff, puncIndex);
		return [punc.concat(word), wordIndex];
	}

	return ["", index];
}

function next(buff: string, index: number, peek: boolean = false) {
	const [ws, wsIndex] = matchWhiteSpace(buff, index);
	if (ws) {
		return token("ws", ws, buff, peek ? index : wsIndex);
	}

	const [lb, lbIndex] = matchLineBreak(buff, index);
	if (lb) {
		return token("lb", lb, buff, peek ? index : lbIndex);
	}

	const [hash, hashIndex] = matchHash(buff, index);
	if (hash) {
		return token("hash", hash, buff, peek ? index : hashIndex);
	}

	const [word, wordIndex] = matchWord(buff, index);
	if (word) {
		return token("word", word, buff, peek ? index : wordIndex);
	}

	return token("other", buff[index] ?? null, buff, peek ? index : index + 1);
}

function feed(buff: string) {
	return token("", "", buff, 0);
}

export { feed };
