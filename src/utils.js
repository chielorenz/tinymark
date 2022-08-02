export const log = (...msg) => {
	if (process.env.DEBUG === "true") console.log("DEBUG:", ...msg);
};
