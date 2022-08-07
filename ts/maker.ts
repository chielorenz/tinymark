import { Node } from "./parser-easy.js";

function generate(node: Node): string {
	let html = "";

	switch (node.type) {
		case "h1":
			for (const value of node.value) {
				const elem = typeof value == "string" ? value : generate(value);
				html += `<h1>${elem}</h1>`;
			}
			break;
		case "p":
			for (const value of node.value) {
				const elem = typeof value == "string" ? value : generate(value);
				html += `<p>${elem}</p>`;
			}
			break;
		default:
			for (const value of node.value) {
				const elem = typeof value == "string" ? value : generate(value);
				html += elem;
			}
	}

	return html;
}

function make(parser: any) {
	const ast = parser.parse();
	return generate(ast);
}

export { make };
