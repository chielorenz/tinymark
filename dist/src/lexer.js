import { useLog } from "./utils.js";
const log = useLog("Lexer |");
const token = (type = "", value = "") => ({
    type,
    value,
});
const buffer = (value = "", match = "") => ({
    value: value.slice(0, 1),
    match: match,
    next: () => buffer(value.slice(1), match.concat(value.slice(0, 1))),
    reset: () => buffer(value),
    done: value.length === 0,
});
const lexer = (token, buf) => ({
    token: token,
    next: () => next(buf),
    peek: () => next(buf, true),
    done: buf.done,
});
const is = (regex, buf) => regex.test(buf.value);
const isDigit = (buf) => is(/\d/, buf);
const isChar = (buf) => is(/[a-zA-Z]/, buf);
const isWS = (buf) => is(/[^\S\r\n]/, buf);
const isMarks = (buf) => is(/[^a-zA-Z0-9\s]/, buf);
const isLB = (buf) => is(/[\n\r]/, buf);
const isHash = (buf) => is(/#/, buf);
const isWord = (buf) => isChar(buf) || isDigit(buf) || isMarks(buf);
const matchWS = (buf) => isWS(buf) ? matchWS(buf.next()) : buf;
const matchWord = (buf) => isWord(buf) ? matchWord(buf.next()) : buf;
function next(buf, peek = false) {
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
const useLexer = (string) => lexer(token(), buffer(string));
export default useLexer;
