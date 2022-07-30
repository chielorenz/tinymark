var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _Lexer_instances, _Lexer_buffer, _Lexer_peak, _Lexer_pop, _Lexer_match, _Lexer_matchWhiteSpace, _Lexer_matchLineBreak, _Lexer_matchHash, _Lexer_matchPunctuation, _Lexer_matchDigit, _Lexer_matchChar, _Lexer_matchText, _Lexer_token;
class Lexer {
    constructor() {
        _Lexer_instances.add(this);
        _Lexer_buffer.set(this, "");
    }
    // Get wheter all input has been consumed
    get done() {
        return __classPrivateFieldGet(this, _Lexer_buffer, "f").length === 0;
    }
    // Set the input string
    eat(string) {
        __classPrivateFieldSet(this, _Lexer_buffer, string, "f");
    }
    // Get the next token, like { symbol: "word", value: "Hello" }
    next() {
        let match;
        match = __classPrivateFieldGet(this, _Lexer_instances, "m", _Lexer_matchWhiteSpace).call(this);
        if (match) {
            return __classPrivateFieldGet(this, _Lexer_instances, "m", _Lexer_token).call(this, "WS", match);
        }
        match = __classPrivateFieldGet(this, _Lexer_instances, "m", _Lexer_matchLineBreak).call(this);
        if (match) {
            return __classPrivateFieldGet(this, _Lexer_instances, "m", _Lexer_token).call(this, "LB", match);
        }
        match = __classPrivateFieldGet(this, _Lexer_instances, "m", _Lexer_matchHash).call(this);
        if (match) {
            return __classPrivateFieldGet(this, _Lexer_instances, "m", _Lexer_token).call(this, "hash", match);
        }
        match = __classPrivateFieldGet(this, _Lexer_instances, "m", _Lexer_matchText).call(this);
        if (match) {
            return __classPrivateFieldGet(this, _Lexer_instances, "m", _Lexer_token).call(this, "text", match);
        }
        return __classPrivateFieldGet(this, _Lexer_instances, "m", _Lexer_token).call(this, "other", __classPrivateFieldGet(this, _Lexer_instances, "m", _Lexer_pop).call(this));
    }
}
_Lexer_buffer = new WeakMap(), _Lexer_instances = new WeakSet(), _Lexer_peak = function _Lexer_peak() {
    return Array.from(__classPrivateFieldGet(this, _Lexer_buffer, "f"))[0];
}, _Lexer_pop = function _Lexer_pop() {
    const peak = __classPrivateFieldGet(this, _Lexer_instances, "m", _Lexer_peak).call(this);
    __classPrivateFieldSet(this, _Lexer_buffer, __classPrivateFieldGet(this, _Lexer_buffer, "f").substring(1), "f");
    return peak;
}, _Lexer_match = function _Lexer_match(pattern) {
    const char = __classPrivateFieldGet(this, _Lexer_instances, "m", _Lexer_peak).call(this);
    if (pattern.includes(char)) {
        return __classPrivateFieldGet(this, _Lexer_instances, "m", _Lexer_pop).call(this);
    }
}, _Lexer_matchWhiteSpace = function _Lexer_matchWhiteSpace() {
    return __classPrivateFieldGet(this, _Lexer_instances, "m", _Lexer_match).call(this, ["\t", " "]);
}, _Lexer_matchLineBreak = function _Lexer_matchLineBreak() {
    return __classPrivateFieldGet(this, _Lexer_instances, "m", _Lexer_match).call(this, "\n\r");
}, _Lexer_matchHash = function _Lexer_matchHash() {
    return __classPrivateFieldGet(this, _Lexer_instances, "m", _Lexer_match).call(this, "#");
}, _Lexer_matchPunctuation = function _Lexer_matchPunctuation() {
    return __classPrivateFieldGet(this, _Lexer_instances, "m", _Lexer_match).call(this, ",./?;:'\"[]{}()\\|~!@$%^&*_-+=`");
}, _Lexer_matchDigit = function _Lexer_matchDigit() {
    return __classPrivateFieldGet(this, _Lexer_instances, "m", _Lexer_match).call(this, "0123456789");
}, _Lexer_matchChar = function _Lexer_matchChar() {
    const chars = "abcdefghijklmnopqrstuvwxzyABCDEFGHIJKLMNOPQRSTUVWXYZ";
    return __classPrivateFieldGet(this, _Lexer_instances, "m", _Lexer_match).call(this, chars);
}, _Lexer_matchText = function _Lexer_matchText() {
    const digit = __classPrivateFieldGet(this, _Lexer_instances, "m", _Lexer_matchDigit).call(this);
    if (digit) {
        const text = __classPrivateFieldGet(this, _Lexer_instances, "m", _Lexer_matchText).call(this);
        return text ? digit + text : digit;
    }
    const char = __classPrivateFieldGet(this, _Lexer_instances, "m", _Lexer_matchChar).call(this);
    if (char) {
        const text = __classPrivateFieldGet(this, _Lexer_instances, "m", _Lexer_matchText).call(this);
        return text ? char + text : char;
    }
    const punc = __classPrivateFieldGet(this, _Lexer_instances, "m", _Lexer_matchPunctuation).call(this);
    if (punc) {
        const text = __classPrivateFieldGet(this, _Lexer_instances, "m", _Lexer_matchText).call(this);
        return text ? punc + text : punc;
    }
}, _Lexer_token = function _Lexer_token(category, lexeme) {
    return { category, lexeme };
};
export default new Lexer();
