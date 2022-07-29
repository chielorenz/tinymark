![Tinymark logo](/logo.svg?raw=true)

Tinymark is a compiler of a subset of the [markdown](https://spec.commonmark.org/0.30/) syntax. It takes a markdown string and returns html.

# 🔥 Scope

Tinymark is in very early development and is meant for educational purposes only, not for production.  

<!-- # 🚀 Getting started

todo -->

# <a name="development"></a>👩‍💻 Development

Install dependencies with:

``` bash
npm install
```

Run a script with:

``` bash
node src/index.js
```

Or watch it with [nodemon](https://www.npmjs.com/package/nodemon):

``` bash
npm run nodemon src/index.js
```

## 🐳 Docker

If you use [docker](https://www.docker.com) you can run commands from a node container using the `run` utility:

``` bash
sh ./run [command]

# For example install dependencies with:
sh ./run npm install
```

See the [development](#development) section for a list of usefull commands.

# 📚 Lexer

`lexer.js` is a simple, hand written lexer that recognize the markdown syntax.

It takes a markdown string and returns a set of tokens, each token has a category an a lexeme. For example:

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

<!-- # 📖 Parser

Todo -->

<!-- # ✍️ Generator

Todo -->

<!-- # 🚧 Avaiable syntax

- [x] Paragraphs
- [x] H1
- [ ] H2 -->

###### Credits

- Logo inspiration: [Astronaut by Alexander Skowalsky from NounProject.com](https://thenounproject.com/icon/astronaut-1784711/)
- Logo font: [Kalam on google fonts](https://fonts.google.com/specimen/Kalam?query=Kalam)
