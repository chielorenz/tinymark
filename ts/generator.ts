import { Node, Parser } from "./parser.js";

const generate = (...nodes: (Node | string)[]): string => {
	const node = nodes[0];
	const rest = nodes.slice(1);

	if (!node) return "";
	if (typeof node == "string") return `${node}${generate(...rest)}`;

	const content = generate(...node.value, ...rest);
	switch (node.type) {
		case "p":
			return `<p>${content}</p>`;
		default:
			return content;
	}
};

const useGenerator = (parser: Parser) => ({
	generate: (): string => generate(parser.parse()),
});

export default useGenerator;
