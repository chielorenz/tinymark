import lexer from "./lexer.js";
import parser from "./parser.js";
import coder from "./coder.js";

class Compiler {
	compile(md) {
		lexer.feed(md);
		parser.use(lexer);
		coder.use(parser);
		return coder.make();
	}
}

export default new Compiler();
