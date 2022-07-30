import lexer from "./lexer.js";

lexer.eat(`# tinymark 
Hello world!`);

while (!lexer.done) {
	console.log(lexer.next());
}
