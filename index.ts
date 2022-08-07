import useLexer from "./ts/lexer.js";
import useParser from "./ts/parser-easy.js";
import { make } from "./ts/maker.js";

const input = `Hello, world!`;

let lexer = useLexer(input);

console.log("Tokens:");
while (!lexer.done) {
	lexer = lexer.next();
	console.log(lexer.token);
}

lexer = useLexer(input);
let parser = useParser(lexer);

const ast = parser.parse();
console.log("AST:");
console.dir(ast, { depth: null });

lexer = useLexer(input);
parser = useParser(lexer);

const html = make(parser);
console.log("HTML:");
console.log(html);
