import useLexer from "./lexer.js";
import useParser from "./parser.js";
import useGenerator from "./generator.js";
const useCompiler = (input) => ({
    compile: () => {
        const lexer = useLexer(input);
        const parser = useParser(lexer);
        const generator = useGenerator(parser);
        return generator.generate();
    },
});
export default useCompiler;
