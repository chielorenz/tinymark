export const useLog =
	(label: string) =>
	(...msg: any[]) => {
		if (process.env.DEBUG === "true") console.log("Debug |", label, ...msg);
	};

export const useLogDeep =
	(label: string) =>
	(object: any, ...msg: any[]) => {
		if (process.env.DEBUG === "true") {
			console.log("Debug |", label, ...msg);
			console.dir(object, { depth: null });
		}
	};
