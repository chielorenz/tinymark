# tinymark

Proof of concept compiler for a small subset of the Markdown syntax. It is composed by a lexer, a parser and a code generator, it takes a markdown string and convert it into html. 

## 🚀 Getting started

Use docker to setup local environment. Run commands from within the container with the `run` utility, like:
```bash
sh ./run [command]
```

Install dependencies:

```bash
sh ./run npm install
```

Run a script:

```bash
sh ./run node src/index.js
```

Watch it with [nodemon](https://www.npmjs.com/package/nodemon):

```bash
sh ./run npm run nodemon src/index.js
```

## 📚 Lexer

Simple hand written lexer that recognize a subset of the markdown syntax.

It takes a markdown string and returns a list of tokens, each token has a category an a lexeme. For example:

``` js
import lexer from "./src/lexer.js";

lexer.eat("# Hello Word!");

while (!lexer.done) {
	console.log(lexer.next());
}

// { category: 'hash',	lexeme: '#'     }
// { category: 'WS',	lexeme: ' '     }
// { category: 'text',	lexeme: 'Hello' }
// { category: 'WS',	lexeme: ' '     }
// { category: 'text',	lexeme: 'Word!' }
```

<!-- ## 📖 Parser

Todo -->

<!-- ## ✍️ Generator

Todo -->