import { log } from "./utils.js";

class Coder {
	#parser = null;

	use(parser) {
		this.#parser = parser;
	}

	#generate(nodes) {
		let html = "";

		for (const node of nodes) {
			log(`Make ${node.type}`);

			switch (node.type) {
				case "h1":
					html += `<h1>${this.#generate(node.value)}</h1>`;
					break;
				case "p":
					html += `<p>${this.#generate(node.value)}</p>`;
					break;
				default:
					if (Array.isArray(node.value)) {
						html += this.#generate(node.value);
					} else {
						html += node.value;
					}
			}
		}

		return html;
	}

	make() {
		const ast = this.#parser.parse();
		console.dir(ast, { depth: null });

		log("Making...");
		return this.#generate([ast]);
	}
}

export default new Coder();
