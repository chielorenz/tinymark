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
// h1 -> %hash %ws+ text
//     | %hash
//
// text -> %word %ws+ text
//     | %word
import { useLog, useLogDeep } from "./utils.js";
const log = useLog("Parser |");
const logDeep = useLogDeep("Parser |");
const node = (type, ...value) => ({
    type,
    value,
});
const is = (type, lexer) => lexer.token.type === type;
const isWS = (lexer) => is("ws", lexer);
const isWord = (lexer) => is("word", lexer);
const isHash = (lexer) => is("hash", lexer);
const isLB = (lexer) => is("lb", lexer);
const isP = (lexer) => isText(lexer);
const isText = (lexer) => (isWord(lexer) && isWS(lexer.next()) && isText(lexer.next().next())) ||
    isWord(lexer);
const isH1 = (lexer) => (isHash(lexer) && isWS(lexer.next()) && isText(lexer.next().next())) ||
    isHash(lexer);
const isContent = (lexer) => isP(lexer) || isH1(lexer);
const isRow = (lexer) => isWS(lexer) ||
    (isWS(lexer) && isContent(lexer.next())) ||
    (isWS(lexer) && isContent(lexer.next()) && isWS(lexer.next().next()));
const match = (type, lexer) => {
    log(`Match "${type}"`);
    if (is(type, lexer)) {
        return [node(type, lexer.token.value), lexer.next()];
    }
    const wrong = lexer.token.type;
    throw new Error(`Syntax error, expected "${type}" got "${wrong}"`);
};
const matchText = (lexer) => {
    log(`Match "text"`);
    const [word, wordLexer] = match("word", lexer);
    if (isWS(lexer.next())) {
        const [ws, wsLexer] = match("ws", wordLexer);
        const [text, textLexer] = matchText(wsLexer);
        return [node("text", word, ws, text), textLexer];
    }
    return [node("text", word), wordLexer];
};
const matchH1 = (lexer) => {
    log(`Match "h1"`);
    const [hash, hashLexer] = match("hash", lexer);
    if (isWS(hashLexer)) {
        const [ws, wsLexer] = match("ws", hashLexer);
        const [text, textLexer] = matchText(wsLexer);
        return [node("h1", text), textLexer];
    }
    return [node("h1", hash), hashLexer];
};
const matchP = (lexer) => {
    log(`Match "p"`);
    const [text, textLexer] = matchText(lexer);
    return [node("p", text), textLexer];
};
const matchContent = (lexer) => {
    log(`Match "content"`);
    if (isP(lexer)) {
        const [p, pLexer] = matchP(lexer);
        return [node("content", p), pLexer];
    }
    if (isH1(lexer)) {
        const [h1, h1Lexer] = matchH1(lexer);
        return [node("content", h1), h1Lexer];
    }
    throw new Error(`Syntax error, expeced "h1" or "p", got "${lexer.token.type}"`);
};
const matchRow = (lexer) => {
    log(`Match "row"`);
    if (isWS(lexer)) {
        const [ws, wsLexer] = match("ws", lexer);
        if (isContent(wsLexer)) {
            const [content, contentLexer] = matchContent(wsLexer);
            if (isWS(contentLexer)) {
                const [otherWs, otherWsLexer] = match("ws", contentLexer);
                return [node("row", ws, content, otherWs), otherWsLexer];
            }
            return [node("row", ws, content), contentLexer];
        }
        return [node("row", ws), wsLexer];
    }
    else {
        if (isContent(lexer)) {
            const [content, contentLexer] = matchContent(lexer);
            if (isWS(contentLexer)) {
                const [ws, wsLexer] = match("ws", contentLexer);
                return [node("row", content, ws), wsLexer];
            }
            return [node("row", content), contentLexer];
        }
    }
    return [node("row"), lexer];
};
const matchMain = (lexer) => {
    log(`Match "main"`);
    const [row, rowLexer] = matchRow(lexer);
    if (isLB(rowLexer)) {
        const [lb, lbLexer] = match("lb", rowLexer);
        const [main, mainLexer] = matchMain(lbLexer);
        return [node("main", row, lb, main), mainLexer];
    }
    return [node("main", row), rowLexer];
};
const useParser = (lexer) => ({
    parse: () => {
        const [main] = matchMain(lexer.next());
        logDeep(main, "AST");
        return main;
    },
});
export default useParser;
