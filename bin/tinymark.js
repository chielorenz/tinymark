#!/usr/bin/env node

import useCompiler from "../dist/src/compiler.js";

const md = process.argv[2];
if (!md) {
	console.log("Usage: tinymark <markdown>");
	process.exit(1);
}

(async () => {
	const compiler = useCompiler(md);
	console.log(compiler.compile());
})();
