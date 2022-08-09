![TinyMark logo](/logo.svg?raw=true)

TinyMark is a compiler of a tiny subset of the [markdown](https://spec.commonmark.org/0.30/) syntax. It takes a markdown string and returns html.

## 🔥 Scope

TinyMark is in very early development and is meant for educational purposes only, not for production.  

<!-- # 🚀 Getting started

todo -->

## <a name="development"></a>👩‍💻 Development

Install dependencies with:

``` bash
npm install
```

Run a script with:

``` bash
npm run ts-node index.ts
```

Or watch it with [nodemon](https://www.npmjs.com/package/nodemon):

``` bash
npm run nodemon index.ts
```

Enable debug messages by setting the `DEBUG` environment variable:

``` bash
DEBUG=true npm run nodemon index.ts
```

Compile TypeScript to JavaScript with:

``` bash
npm run tsc
```

Generated files are in the `dist` folder.

## 🐳 Docker

If you use [docker](https://www.docker.com) you can run commands from a node container using the `run` utility:

``` bash
sh ./run [command]

# For example install dependencies with:
sh ./run npm install
```

See the [development](#development) section for a list of usefull commands.

## 📚 Lexer

`lexer.ts` is a simple lexer that recognize a tiny subset of the markdown syntax.

It takes a markdown string and returns a set of tokens, each token has a type and a value:

``` typescript
import useLexer from "./src/lexer.js";

const input = `# Hello, World!`;
let lexer = useLexer(input);

while (!lexer.done) {
	lexer = lexer.next();
	console.log(lexer.token);
}

// Prints:
{ type: 'hash', value: '#' }
{ type: 'ws', value: ' ' }
{ type: 'word', value: 'Hello,' }
{ type: 'ws', value: ' ' }
{ type: 'word', value: 'World!' }
```

## 📖 Parser

`parser.ts` is a simple parser for a tiny subset of the markdown syntax. 

It'a an hand coded, predictive (no backtracking), recursive descending parser. Given a lexer it returns an abstract syntax tree (AST) that represents the input string.

``` typescript
import useLexer from "./src/lexer.js";
import useParser from "./src/parser.js";

const input = `# Hello, World!`;
const lexer = useLexer(input);
const parser = useParser(lexer);
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
                {
                  type: 'text',
                  value: [
                    { type: 'word', value: [ 'Hello,' ] },
                    { type: 'ws', value: [ ' ' ] },
                    {
                      type: 'text',
                      value: [ { type: 'word', value: [ 'World!' ] } ]
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

## ✍️ Generator 

`generator.ts` is a simple code generator that can build html from a tiny subset of the markdown syntax.

It takes an AST and returns a string of html.

``` typescript
import lexer from "./lexer.js";
import parser from "./parser.js";
import coder from "./coder.js";

const input = `# Hello, World!`;
const lexer = useLexer(input);
const parser = useParser(lexer);
const generator = useGenerator(parser);
const html = generator.generate();
console.log(html);

// Prints:
<h1>Hello, World!</h1>
```

## 📝 Compiler
`compiler.ts` is a simple compiler that can build html from a tiny subset of the markdown syntax.

It glues togheter the lexer, parser and generator. It takes a markdown string and returns a string of html.

``` typescript
import useCompiler from "./src/compiler.js";

const input = `# Hello, World!`;
const compiler = useCompiler(input);
const html = compiler.compile();
console.log(html);

// Prints:
<h1>Hello, World!</h1>
```

## 🚧 Avaiable syntax

Only a tiny subset of the markdown syntax is supported:

- H1
- Paragraph

###### Credits

- Logo inspiration: [Astronaut by Alexander Skowalsky from NounProject.com](https://thenounproject.com/icon/astronaut-1784711/)
- Logo font: [Kalam on google fonts](https://fonts.google.com/specimen/Kalam?query=Kalam)
