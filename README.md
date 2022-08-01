![TinyMark logo](/logo.svg?raw=true)

TinyMark is a compiler of a tiny subset of the [markdown](https://spec.commonmark.org/0.30/) syntax. It takes a markdown string and returns html.

# 🔥 Scope

TinyMark is in very early development and is meant for educational purposes only, not for production.  

<!-- # 🚀 Getting started

todo -->

# <a name="development"></a>👩‍💻 Development

Install dependencies with:

``` bash
npm install
```

Run a script with:

``` bash
node index.js
```

Or watch it with [nodemon](https://www.npmjs.com/package/nodemon):

``` bash
npm run nodemon index.js
```

Enable debug messages by setting the `DEBUG` environment variable:

``` bash
DEBUG=true npm run nodemon index.js
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
import lexer from "./lexer.js";

lexer.feed("# Hello Word!");

let token;
while (!lexer.done) {
	token = lexer.next();
	console.log(token);
}

// Prints:
{ category: 'hash', lexeme: '#' }
{ category: 'ws', lexeme: ' ' }
{ category: 'text', lexeme: 'Hello' }
{ category: 'ws', lexeme: ' ' }
{ category: 'text', lexeme: 'Word!' }
```

# 📖 Parser

`parser.js` is a parser for a tiny subset of the markdown syntax. It'a an hand coded, predictive (no backtracking), recursive descending parser. Given a lexer it returns an abstract syntax tree (AST) that represents the input string.

``` js
import lexer from "./lexer.js";
import parser from "./parser.js";

lexer.feed("# Hello Word!");
parser.use(lexer);
const ast = parser.parse();
console.log(ast);

// Prints:
{
  type: 'main',
  value: [
    {
      type: 'row',
      value: [
        {
          type: 'content',
          value: [
            {
              type: 'h1',
              value: [
                { type: 'hash', value: '#' },
                {
                  type: 'text',
                  value: [
                    { type: 'word', value: 'Hello' },
                    {
                      type: 'text',
                      value: [ { type: 'word', value: 'Word!' } ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}
```

# ✍️ Coder 

`coder.js` is a simple code generator that takes an AST and returns a string of html.

``` js
import lexer from "./lexer.js";
import parser from "./parser.js";
import coder from "./coder.js";

lexer.feed("# Hello Word!");
parser.use(lexer);
coder.use(parser);
console.log(coder.make());

// Prints:
<h1>Hello Word!</h1>
```

# 🚧 Avaiable markdown syntax

Only a tiny subset of the markdown syntax is supported:

- H1
- Paragraph

###### Credits

- Logo inspiration: [Astronaut by Alexander Skowalsky from NounProject.com](https://thenounproject.com/icon/astronaut-1784711/)
- Logo font: [Kalam on google fonts](https://fonts.google.com/specimen/Kalam?query=Kalam)
