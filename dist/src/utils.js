const BLUE = "\x1b[34m";
const RESET = "\x1b[0m";
export const useLog = (label) => (...msg) => {
    if (process.env.DEBUG === "true")
        console.log(BLUE, label, ...msg, RESET);
};
export const useLogDeep = (label) => (object, ...msg) => {
    if (process.env.DEBUG === "true") {
        console.log(BLUE, label, ...msg, RESET);
        console.dir(object, { depth: null });
    }
};
