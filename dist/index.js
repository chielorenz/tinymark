import useCompiler from "./src/compiler.js";
const input = `# Hello, World!`;
const compiler = useCompiler(input);
const html = compiler.compile();
console.log(html);
