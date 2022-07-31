import lexer from "./lexer.js";
import parser from "./parser.js";

const md = `# TinyMark
Compiler`;

console.log(`DEBUG: matching "${md}"`);

lexer.eat(md);
parser.use(lexer);
const ast = parser.parse();

console.log(ast);
