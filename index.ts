import useCompiler from "./ts/compiler.js";

const input = `Hello, world!`;
const compiler = useCompiler(input);
const output = compiler.compile();
console.log(output);
