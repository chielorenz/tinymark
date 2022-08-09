import { useLog } from "./utils.js";
const log = useLog("Generator |");
const generate = (...nodes) => {
    const node = nodes[0];
    const rest = nodes.slice(1);
    if (!node)
        return "";
    if (typeof node == "string") {
        log(`Generate string "${node}"`);
        return `${node}${generate(...rest)}`;
    }
    log(`Generate "${node.type}"`);
    const nodeContent = generate(...node.value);
    const restContent = generate(...rest);
    switch (node.type) {
        case "p":
            return `<p>${nodeContent}</p>${restContent}`;
        case "h1":
            return `<h1>${nodeContent}</h1>${restContent}`;
        default:
            return `${nodeContent}${restContent}`;
    }
};
const useGenerator = (parser) => ({
    generate: () => {
        const output = generate(parser.parse());
        log(`Output "${output}"`);
        return output;
    },
});
export default useGenerator;
