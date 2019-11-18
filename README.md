# esm-and-other-format-libraries-starter

This is a start kit for developing ECMAScript standard EM Modules format library with TypeScript.

## Explanation of Build Files.

|ES Module|UMD|CommonJS|
|--|--|--|
|yourLibrary.esm.js|yourLibrary.js|yourLibrary.common.js|

## Create your library.

In this chapter, we will explain how to implement libraries in three formats: ECMAScript standard, CommonJS, and UMD.  

1. Create project.

    ```sh
    mkdir yourLibrary && cd $_;
    ```

1. Create project configuration file.

    Execute the following command.  
    This will create package.json at the root of the project.  

    ```sh
    npm init -y;
    ```

    Open package.json and edit as follows.  

    ```js
    ...
    "main": "dist/yourLibrary.common.js",
    "module": "dist/yourLibrary.esm.js",
    "browser": "dist/yourLibrary.js",
    "types": "types/yourLibrary.d.ts",
    ...
    ```

    |Name|Value|Description|
    |--|--|--|
    |main|dist/yourLibrary.common.js|Library name to output in CommonJS format.|
    |module|dist/yourLibrary.esm.js|Library name to output in ES Modules format.|
    |browser|dist/yourLibrary.js|Library name output in UMD format.|
    |types|types/yourLibrary.d.ts|Set the typescript declaration file.|

1. Install required packages.
 
    ```sh
    npm i -D \
        typescript \
        ts-node \
        tsconfig-paths \
        rollup \
        rollup-plugin-typescript2 \
        rollup-plugin-terser \
        jest \
        @types/jest \
        ts-jest;
    ```

    |Name|Description|
    |--|--|
    |typescript|Used to compile TypeScript source code into JavaScript.|
    |ts-node|Used to execute TypeScript code on a node and immediately check the result.|
    |tsconfig-paths|Used to resolve paths (alias) in tsconfig.json at runtime with ts-node.|
    |rollup|Rollup is a module bundler.<br>Used to bundle ES Modules, CommonJS, and UMD libraries for distribution to clients.|
    |rollup-plugin-typescript2|Plug-in for processing typescript with rollup.|
    |rollup-plugin-terser|Used to compress bundle files.|
    |jest|Jest is a library for testing JavaScript code.|
    |@types/jest|Jest's type declaration.|
    |ts-jest|A TypeScript preprocessor required to test projects written in TypeScript using Jest.|

1. Create a TypeScript compilation configuration.

    Create TypeScript compilation configuration file.  

    ```sh
    touch tsconfig.json;
    ```

    Add content:

    ```js
    {
      "compilerOptions": {
        "target": "ESNext",
        "module": "ESNext",
        "declarationDir": "./types",
        "declaration": true,
        "outDir": "./dist",
        "rootDir": "./src",
        "strict": true,
        "noImplicitAny": true,
        "baseUrl": "./",
        "paths": {"~/*": ["src/*"]},
        "esModuleInterop": true
      },
      "include": [
        "src/**/*"
      ],
      "exclude": [
        "node_modules",
        "**/*.test.ts"
     ]
    }
    ```

    |Option||Value|Description|
    |--|--|--|--|
    |compilerOptions|||
    ||target|ESNext|Specify ECMAScript target version.<br>"ESNext" targets latest supported ES proposed features.|
    ||module|ESNext|Specify module code generation.<br>"ESNext" is an ECMAScript standard, and import/export in typescript is output as import/export.|
    ||declarationDir|./types|Output directory for generated declaration files.|
    ||declaration|true|Generates corresponding .d.ts file.|
    ||outDir|./dist|Output directory for compiled files.|
    ||rootDir|./src|Specifies the root directory of input files.|
    ||baseUrl|./|Base directory to resolve non-relative module names.|
    ||paths|{<br>&nbsp;&nbsp;"~/\*": ["src/\*"]<br>}|List of path mapping entries for module names to locations relative to the baseUrl.<br><br>Set the alias of "/ src" directly under the root with "~ /".<br>e.g. import Awesome from '~/components/Awesome';|
    |include||[<br>&nbsp;&nbsp;"src/\*\*/\*"<br>]|A list of glob patterns that match the files to be included in the compilation.<br>Set the source directory.|
    |exclude||[<br>&nbsp;&nbsp;"node_modules",<br>&nbsp;&nbsp;"\*\*/\*.test.ts"<br>]|A list of files to exclude from compilation.<br>Set node_modules and unit test code.|

1. Create a library module with a type script.  

    Create a directory to store source files.  

    ```sh
    mkdir src;
    ```

    Submodule that calculates the subtraction.  

    ```js
    // src/add.ts
    /**
     * Sum two values
     */
    export default function(a:number, b:number):number {
      return a + b;
    }
    ```

    Submodule that calculates the addition.  

    ```js
    // src/sub.ts
    /**
     * Diff two values
     */
    export default function(a:number, b:number):number {
      return a - b;
    }
    ```

    Main module that imports multiple modules and exports a single library.  

    ```js
    // src/yourLibrary.ts
    import add from '~/add';
    import sub from '~/sub';
    export {add, sub};
    ```

1. Let's run the library on node.

    Run the following command.  
    To run on node, it is important to set the module option to CommonJS.  

    ```sh
    npx ts-node -r tsconfig-paths/register -P tsconfig.json -O '{"module":"commonjs"}' -e "\
        import {add} from '~/yourLibrary';
        console.log('1+2=' + add(1,2));";# 1+2=3
    ```
1. Setting up and running unit tests.  

    Create unit test configuration file.

    ```sh
    touch jest.config.js;
    ```

    Add content:

    ```js
    const { pathsToModuleNameMapper } = require('ts-jest/utils');
    const { compilerOptions } = require('./tsconfig.json');
    module.exports = {
      roots: [
        '<rootDir>/src',
        '<rootDir>/tests/'
      ],
      transform: {
        '^.+\\.tsx?$': 'ts-jest'
      },
      testRegex: '(/tests/.*|(\\.|/)(test|spec))\\.tsx?$',
      moduleFileExtensions: [
        'ts',
        'js'
      ],
      moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths , { prefix: '<rootDir>/' })
      // moduleNameMapper: {
      //   '^~/(.+)': '<rootDir>/src/$1'
      // }
    }
    ```

    |Name|Description|
    |--|--|
    |roots|A list of paths to directories that Jest should use to search for files in.<br>Specify the directory path where the source code (./src) and test code (./tests) files are located.|
    |transform|Instruct Jest to transpile TypeScript code with ts-jest.|
    |testRegex|Specify the file and directory to be teste.|
    |moduleFileExtensions|Specifies the extension of the file to be tested.|
    |moduleNameMapper|Apply alias setting of actual path set in "baseUrl" and "paths" of tsconfig.json.|

    Create a tests directory to store test code at the root of the project.  

    ```sh
    mkdir tests;
    ```

    Then, Create add.test.ts and sub.test.ts files in the tests directory.  
    This will contain our actual test.  

    ```js
    // tests/add.test.ts
    import {add} from '~/yourLibrary';
    test('Add 1 + 2 to equal 3', () => {
      expect(add(1, 2)).toBe(3);
    });    
    ```

    ```js
    // tests/sub.test.ts
    import {sub} from '~/yourLibrary';
    test('Subtract 1 - 2 to equal -1', () => {
      expect(sub(1, 2)).toBe(-1);
    });
    ```

    Open your package.json and add the following script.  

    ```js
    ...
    "scripts": {
      "test": "jest"
    ...
    ```

    Run the test.  

    ```sh
    npm run test;
    ```

    Jest will print this message.  
    You just successfully wrote your first test.  

    ```sh
    PASS  tests/add.test.ts
    PASS  tests/sub.test.ts

    Test Suites: 2 passed, 2 total
    Tests:       2 passed, 2 total
    Snapshots:   0 total
    Time:        1.332s, estimated 3s
    Ran all test suites.
    ```

1. Configure and run the build.  
Compile the TypeScript library and resolve the module dependency to create a library that can be distributed to clients.

    Create a build configuration file.

    ```sh
    touch rollup.config.js;
    ```

    Add content:  

    ```js
    import typescript from 'rollup-plugin-typescript2';
    import { terser } from "rollup-plugin-terser";
    import pkg from './package.json';
    export default {
      external: Object.keys(pkg['dependencies'] || []),
      input: './src/yourLibrary.ts',
      plugins: [
        typescript({
          tsconfigDefaults: { compilerOptions: {} },
          tsconfig: "tsconfig.json",
          tsconfigOverride: { compilerOptions: {} },
          useTsconfigDeclarationDir: true
        }),
        terser()
      ],
      output: [
        // ES module (for bundlers) build.
        {
          format: 'esm',
          file: pkg.module
        },
        // CommonJS (for Node) build.
        {
          format: 'cjs',
          file: pkg.main
        },
        // browser-friendly UMD build
        {
          format: 'umd',
          file: pkg.browser,
          name: pkg.browser.replace(/^.*\/|\.js$/g, '')
        }
      ]
    }
    ```

    |Name|Description|
    |--|--|
    |external|Comma-separate list of module IDs to exclude.|
    |input|The bundle's entry point(s) (e.g. your main.js or app.js or index.js).|
    |plugins|Plugins allow you to customise Rollup's behaviour by, for example,<br>transpiling code before bundling, or finding third-party modules in your node_modules folder.<br>Use rollup-plugin-typescript2 and rollup-plugin-terser.<br>rollup-plugin-typescript2 is a TypeScript loader, and this plugin reads "tsconfig.json" by default.<br>rollup-plugin-terser compresses source code.|
    |output|The output destination of the bundle.<br>Three types of libraries, ES Modules, CommonJS, and UMD, are output.|

    Open your package.json and add the following script.  

    ```js
    ...
    "scripts": {
      "build": "rollup -c"
    }
    ...
    ```

    Run the build.

    ```sh
    npm run build;
    ```

    The library compilation result and declaration file are output to the project root.  
    You just built successfully.  

    ```
    .
        -- dist/
            -- yourLibrary.esm.js
            -- yourLibrary.common.js
            -- yourLibrary.js
        -- types/
            -- yourLibrary.d.ts
            -- add.d.ts
            -- sub.d.ts
    ```

## How to publish a npm package

1. Create an NPM user locally.  
When the command is executed, a '~/.npmrc' file is created and the entered information is stored.

    ```sh
    npm set init.author.name 'Your name';
    npm set init.author.email 'your@email.com';
    npm set init.author.url 'https://your-url.com';
    npm set init.license 'MIT';
    npm set init.version '1.0.0';
    ```

1. Create a user on [npm](https://www.npmjs.com/).  
If the user is not registered yet, enter the new user information to be registered in npm.  
If an npm user has already been created, enter the user information and log in.

    ```sh
    npm adduser;
    ```

1. Create a repository on GitHub and clone.

    ```sh
    git clone https://github.com/your-user/your-repository.git;
    ```

1. Setting files to be excluded from publishing

    Create an .npmignore file at the root of the project.  

    ```
    .npmignore
    ```

    Add node_modules and package-lock.json to .npmignore not to publish.

    ```
    node_modules/
    package-lock.json
    ```

1. Create v1.0.0 tag on GitHub.

    ```sh
    git tag -a v1.0.0 -m 'My first version v1.0.0';
    git push origin v1.0.0;
    ```

1. Publish to npm

    ```sh
    npm publish;
    ```

## How to upgrade NPM packages

1. Push program changes to github

    ```sh
    git commit -am 'Update something';
    git push;
    ```

1. Increase version

    ```sh
    npm version patch -m "Update something";
    ```

1. Create a new version tag on Github

    ```sh
    git push --tags;
    ```

1. Publish to npm

    ```sh
    npm publish;
    ```

## Try this library

1. Create project.

    ```sh
    mkdir myapp && cd $_;
    ```

1. Create project configuration file.

    ```sh
    npm init -y;
    ```

1. Install this library.

    ```sh
    npm i -S esm-and-other-format-libraries-starter;
    ```

1. Create HTML.

    ```sh
    touch index.html;
    ```

1. Try the library.

    - For ES Modules:

        > The ES Modules library can be run in the browser immediately without compiling.

        Add the following code to myapp/index.html and check with your browser.  

        ```js
        <script type="module">
        import { add } from './node_modules/esm-and-other-format-libraries-starter/dist/mylib.esm.js';
        console.log(`1+2=${add(1,2)}`);// 1+2=3
        </script>
        ```

    - For CommonJS:

        >The CommonJS library cannot be executed in the browser as it is, so it must be compiled into a format that can be executed in the browser.

        Install webpack for build.  

        ```sh
        npm i -D webpack webpack-cli;
        ```

        Create a module that runs the library.  
        Prepare myapp/app.js and add the following code.  

        ```js
        import {add} from 'esm-and-other-format-libraries-starter';
        console.log(`1+2=${add(1,2)}`);// 1+2=3
        ```

        Compile "myapp/app.js" into a format that can be executed by a browser.  
        The compilation result is output to "myapp/app.budle.js".  

        ```sh
        npx webpack app.js -o bundle.js;
        ```

        Add the following code to myapp/index.html and check with your browser.  

        ```html
        <script src="bundle.js"></script>
        ```

    - For UMD:

        > The UMD library can be executed globally.
        > It's very easy, but I don't like it because it makes module dependencies unclear.

        Add the following code to myapp/index.html and check with your browser.  

        ```html
        <script src="node_modules/esm-and-other-format-libraries-starter/dist/mylib.js"></script>
        <script>
        console.log(`1+2=${mylib.add(1,2)}`);// 1+2=3
        </script>
        ```

## Difference in tscofig module output results.

> Check what JavaScript code is generated according to the setting value of module of tsconfig.

1. The following is a module written in TypeScript used in the experiment.

    Main module.  

    ```js
    // ./src/app.ts
    import add from './add';
    const result = add(1, 2);
    ```

    Sub module.  
 
    ```js
    // ./src/add.ts
    export default function (a:number, b:number):number {
      return a + b;
    }
    ```

1. Experimental results

    - 'target' is 'ESNext' and 'module' is 'es2015' or 'ESNext':  

        ```js
        // ./dist/app.js
        import add from './add';
        const result = add(1, 2);
        ```

        ```js
        // ./dist/add.js
        export default function (a, b) {
            return a + b;
        }
        ```

    - 'target' is 'ESNext' and 'module' is 'none' or 'commonjs':  

        ```js
        // ./dist/app.js
        "use strict";
        var __importDefault = (this && this.__importDefault) || function (mod) {
            return (mod && mod.__esModule) ? mod : { "default": mod };
        };
        Object.defineProperty(exports, "__esModule", { value: true });
        const add_1 = __importDefault(require("./add"));
        const result = add_1.default(1, 2);
        ```

        ```js
        // ./dist/add.js
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        function default_1(a, b) {
            return a + b;
        }
        exports.default = default_1;
        ```

    - 'target' is 'ESNext' and 'module' is 'amd':  

        ```js
        ./dist/app.js
        var __importDefault = (this && this.__importDefault) || function (mod) {
            return (mod && mod.__esModule) ? mod : { "default": mod };
        };
        define(["require", "exports", "./add"], function (require, exports, add_1) {
            "use strict";
            Object.defineProperty(exports, "__esModule", { value: true });
            add_1 = __importDefault(add_1);
            const result = add_1.default(1, 2);
        });
        ```

        ```js
        // ./dist/add.js
        define(["require", "exports"], function (require, exports) {
            "use strict";
            Object.defineProperty(exports, "__esModule", { value: true });
            function default_1(a, b) {
                return a + b;
            }
            exports.default = default_1;
        });
        ```

    - 'target' is 'ESNext' and 'module' is 'system':  

        ```js
        // ./dist/app.js
        System.register(["./add"], function (exports_1, context_1) {
            "use strict";
            var add_1, result;
            var __moduleName = context_1 && context_1.id;
            return {
                setters: [
                    function (add_1_1) {
                        add_1 = add_1_1;
                    }
                ],
                execute: function () {
                    result = add_1.default(1, 2);
                }
            };
        });
        ```

        ```js
        // ./dist/add.js
        System.register([], function (exports_1, context_1) {
            "use strict";
            var __moduleName = context_1 && context_1.id;
            function default_1(a, b) {
                return a + b;
            }
            exports_1("default", default_1);
            return {
                setters: [],
                execute: function () {
                }
            };
        });
        ```

    - 'target' is 'ESNext' and 'module' is 'umd':  

        ```js
        // ./dist/app.js
        var __importDefault = (this && this.__importDefault) || function (mod) {
            return (mod && mod.__esModule) ? mod : { "default": mod };
        };
        (function (factory) {
            if (typeof module === "object" && typeof module.exports === "object") {
                var v = factory(require, exports);
                if (v !== undefined) module.exports = v;
            }
            else if (typeof define === "function" && define.amd) {
                define(["require", "exports", "./add"], factory);
            }
        })(function (require, exports) {
            "use strict";
            Object.defineProperty(exports, "__esModule", { value: true });
            const add_1 = __importDefault(require("./add"));
            const result = add_1.default(1, 2);
        });
        ```

        ```js
        // ./dist/add.js
        (function (factory) {
            if (typeof module === "object" && typeof module.exports === "object") {
                var v = factory(require, exports);
                if (v !== undefined) module.exports = v;
            }
            else if (typeof define === "function" && define.amd) {
                define(["require", "exports"], factory);
            }
        })(function (require, exports) {
            "use strict";
            Object.defineProperty(exports, "__esModule", { value: true });
            function default_1(a, b) {
                return a + b;
            }
            exports.default = default_1;
        });
        ```

## Reference
- [Compiler Options · TypeScript](https://www.typescriptlang.org/docs/handbook/compiler-options.html)

## License
[MIT](LICENSE.txt)

## Author
- Twitter: [@TakuyaMotoshima](https://twitter.com/taaaaaaakuya)
- Github: [TakuyaMotoshima](https://github.com/takuya-motoshima)
mail to: development.takuyamotoshima@gmail.com
