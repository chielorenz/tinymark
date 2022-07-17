# Tinymark

Proof of concept lexer, parser and compiler for a small subset of the Markdown syntax.

## Using Docker

Run node commands with:
```bash
docker run \
	--rm 		`# remove container when done` \
	-v $(pwd):/src	`# bind source folder` \
	-w /src		`# set workdir` \
	node:18-alpine	`# use node 18` \
	node hello.js	`# run hello.js`
```

Or for short:
```bash
sh ./run hello.js
```
