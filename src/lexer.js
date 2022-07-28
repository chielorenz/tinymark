const regexes = {
	nl: /[\r\n]+/y,
	ws: /\s+/y,
	hash: /#/y,
	word: /\w+/y,
};

export default {
	// Position of the input to consume next
	index: 0,

	// The input string to be consumed
	input: "",

	// Whether the input string has been consumed
	done: false,

	// Get the next token, like { symbol: 'word', value: 'hello' }
	next: function () {
		let token = null;

		// Match each regex to the input string on the current index
		for (const [symbol, regex] of Object.entries(regexes)) {
			regex.lastIndex = this.index;
			const res = regex.exec(this.input);
			if (res) {
				this.index = regex.lastIndex;
				token = { symbol, value: res[0] };
				break;
			}
		}

		// If not match is found but it there is more input to consume throw an error
		if (!token && this.index != this.input.length) {
			const string = this.input.slice(this.index);
			throw new Error(`No match found, but input not empty: "${string}"`);
		}

		// Set done if all input is consumed
		this.done = this.index == this.input.length;

		return token;
	},
};
