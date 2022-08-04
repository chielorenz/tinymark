const log = (...msg: any[]) => {
	if (process.env.DEBUG === "true") console.log("Debug |", ...msg);
};

export const useLog =
	(label: string) =>
	(...msg: any[]) =>
		log(label, ...msg);

const logDeep = (object: any, ...msg: any[]) => {
	if (process.env.DEBUG === "true") {
		console.log("Debug |", ...msg);
		console.dir(object, { depth: null });
	}
};

export const useLogDeep =
	(label: string) =>
	(object: any, ...msg: any[]) =>
		logDeep(object, label, ...msg);
