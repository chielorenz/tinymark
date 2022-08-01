import compiler from "./src/compiler.js";

const md = `# Hello Word!`;
const html = compiler.compile(md);

console.log(html);
