export const log = (...msg: any[]) => {
	if (process.env.DEBUG === "true") console.log("DEBUG:", ...msg);
};

export const logDeep = (object: any, msg: string = "") => {
	if (process.env.DEBUG === "true") {
		console.log("DEBUG:", msg);
		console.dir(object, { depth: null });
	}
};
