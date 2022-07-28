import { readFile } from "fs/promises";
import lexer from "./lexer.js";

lexer.input = await readFile("input.md", "utf8");

while (!lexer.done) {
	console.log(lexer.next());
}
