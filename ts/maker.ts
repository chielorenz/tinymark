import { Ast } from "./parser.js";
import { log } from "./utils.js";

function generate(nodes: Ast[]): string {
	let html = "";

	for (const node of nodes) {
		log(`Make ${node.type}`);

		switch (node.type) {
			case "h1":
				if (Array.isArray(node.value)) {
					html += `<h1>${generate(node.value)}</h1>`;
				}
				break;
			case "p":
				if (Array.isArray(node.value)) {
					html += `<p>${generate(node.value)}</p>`;
				}
				break;
			default:
				if (Array.isArray(node.value)) {
					html += generate(node.value);
				} else {
					html += node.value;
				}
		}
	}

	return html;
}

function make(parse: any) {
	const ast = parse();

	log("Making...");
	return generate([ast]);
}

export { make };
