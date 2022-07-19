import { readFile } from "fs/promises";

const regex = {
	nl: /[\r\n]+/y,
	// ws: /\s+/y,
	h3: /#{3}/y,
	h2: /#{2}/y,
	h1: /#/y,
	text: /[^\n\r]+/y,
};

export default {
	regex: Object.entries(regex),
	index: null,
	raw: null,
	eat: async function (file) {
		this.raw = await readFile(file, { encoding: "utf8" });
	},
	next: function () {
		let token = null;

		for (const [symbol, regex] of this.regex) {
			regex.lastIndex = this.index;
			const res = regex.exec(this.raw);
			if (res) {
				this.index = regex.lastIndex;
				token = { symbol, value: res[0] };
				break;
			}
		}

		// If not match is found but it didn't reach the end of the input
		if (!token && this.index != this.raw.length) {
			const string = this.raw.slice(this.index);
			throw new Error(`No token found but input not empty: "${string}"`);
		}

		return token;
	},
};
