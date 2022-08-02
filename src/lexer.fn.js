function match(patter, buff, index) {
	const char = buff[index];

	if (patter.includes(char)) {
		return [char, index + 1];
	}

	return ["", index];
}

function matchWhiteSpace(buff, index) {
	return match("\t ", buff, index);
}

function matchLineBreak(buff, index) {
	return match("\n\r", buff, index);
}

function matchHash(buff, index) {
	return match("#", buff, index);
}

function matchDigit(buff, index) {
	return match("0123456789", buff, index);
}

function matchChar(buff, index) {
	const chars = "abcdefghijklmnopqrstuvwxzyABCDEFGHIJKLMNOPQRSTUVWXYZ";
	return match(chars, buff, index);
}

function matchPunctuation(buff, index) {
	return match(",./?;:'\"[]{}()\\|~!@$%^&*_-+=`", buff, index);
}

function matchWord(buff, index) {
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

/**
 * @param {string} type Token type
 * @param {string} value Token value
 * @param {string} buff The buffer
 * @param {integer} index The index
 */
function token(type, value, buff, index) {
	return {
		lex: { type, value },
		next: (peek) => next(buff, index, peek),
		done: index >= buff.length,
	};
}

function next(buff, index, peek = false) {
	const [ws, wsIndex] = matchWhiteSpace(buff, index);
	if (ws) return token("ws", ws, buff, peek ? index : wsIndex);

	const [lb, lbIndex] = matchLineBreak(buff, index);
	if (lb) return token("lb", lb, buff, peek ? index : lbIndex);

	const [hash, hashIndex] = matchHash(buff, index);
	if (hash) return token("hash", hash, buff, peek ? index : hashIndex);

	const [word, wordIndex] = matchWord(buff, index);
	if (word) return token("word", word, buff, peek ? index : wordIndex);

	return token("other", buff[index] ?? null, buff, peek ? index : index + 1);
}

function feed(buff) {
	return token(null, null, buff, 0);
}

export { feed };
