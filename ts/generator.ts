import { Node, Parser } from "./parser.js";
import { useLog } from "./utils.js";
const log = useLog("Generator |");

const generate = (...nodes: (Node | string)[]): string => {
	const node = nodes[0];
	const rest = nodes.slice(1);

	if (!node) return "";
	if (typeof node == "string") {
		log(`Generate string "${node}"`);
		return `${node}${generate(...rest)}`;
	}

	log(`Generate "${node.type}"`);

	const content = generate(...node.value, ...rest);
	switch (node.type) {
		case "p":
			return `<p>${content}</p>`;
		case "h1":
			return `<h1>${content}</h1>`;
		default:
			return content;
	}
};

const useGenerator = (parser: Parser) => ({
	generate: (): string => {
		const output = generate(parser.parse());
		log(`Output "${output}"`);
		return output;
	},
});

export default useGenerator;
