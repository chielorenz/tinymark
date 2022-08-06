import useLexer from "./ts/lexer.js";
import useParser from "./ts/parser.js";
import { make } from "./ts/maker.js";

const input = `# Hello, world!
This is a paragraph.`;

let lexer = useLexer(input);
const parser = useParser(lexer);
const html = make(parser);

console.log(html);
