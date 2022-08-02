import { feed } from "./ts/lexer.js";
import { useParser } from "./ts/parser.js";
import { make } from "./ts/maker.js";

const buff = `# Hello, world!
This is a paragraph.`;
const lexer = feed(buff);
const parse = useParser(lexer);
const html = make(parse);

console.log(html);
