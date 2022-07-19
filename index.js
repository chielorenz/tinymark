import lexer from "./lexer.js";

await lexer.eat("input.md");

let token = lexer.next();
while (token) {
	console.log(token);
	token = lexer.next();
}
