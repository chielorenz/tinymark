import { feed } from "./lexer.fn.js";

const buff = `> # Hello, world!`;

let token = feed(buff);

while (!token.done) {
	token = token.next();
	console.log(token);
}
