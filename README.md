# Project Name: Blog Management System 

# Live URL:

```bash
https://blogapil2a3.vercel.app/
```

# Project Description

Welcome to BlogBridge!
BlogBridge is a full-stack blog management platform that enables users to create, read, update, and delete blog posts effortlessly. Designed with modern web technologies, the project features robust user authentication, role-based access control, and an intuitive user interface.

This platform is ideal for bloggers and admins, providing features like personalized blog management, advanced search and filter functionality, and administrative tools for moderating content.

# Technologies Used

- Typescript (Programming language)
- Express.js (Node.js framework)
- Mongoose (MongoDB ORM)
- Zod (Validation Library)
- Bcrypt.js (Secure Password)
- jsonwebtoken (authentication and authorization)
- Eslint (Error showing)
- Prettier (Format code)

# Features

- SignUp and Login Admin
- SignUp and Login User
- Create service
- Authentication
- Authorization
- Blog Management System
- Secure Password

# Backend server setup and how to running

## step-1: initialize npm and setup basic express server

### Initialize node package manager(NPM) with default input

```javascript
npm init -y
```

### Install the express, cors, jsonwebtoken, and dotenv package 

```javascript
npm install express cors dotenv jsonwebtoken bcrypt zod
```

### Make folder structure using modular pattern

```javascript
src
    app
      middleware
      errors
      builder
      routes
      utils
      interfaces
      config
        index.ts
      modules
        users
            ...files
        blog
            ...fils
    app.ts
    server.ts
```

### Install types of node, express, and cors http-status

```javascript
npm i --save-dev @types/cors @types/node @types/express/http-status
```

# step-2: initialize typescript with related package

### Install typescript developer dependency

```javascript
npm install -D typescript
```

### Initialize typescript and configuration it the tsconfig.json

```javascript
tsc --init
```

### In the tsconfig change the root directory and out directory destination. (Note: uncomment the rootDir and outDir)

```javascript
"rootDir": "./src",
"outDir": "./dist",
```

### Run typescript code install ts-node-dev as developer dependency

```javascript
npm install -D ts-node-dev
```

# step-3: install mongoose and connect with project and .env code add

### Install mongoose

```javascript
npm install mongoose
```

### Connect with mongoose this following code

```javascript
import mongoose from 'mongoose';
import config from './app/config';
import app from './app';

async function main() {
  try {
    await mongoose.connect(config.database_url as string);

    app.listen(config.port, () => {
      console.log(`Server listening on port ${config.port}`);
    });
  } catch (error) {
    console.log(error);
  }
}

main();
```

# step-4: install eslint and prettier for typescript

### Install all package related eslint and prettier for typescript as developer dependency

```javascript
npm install --save-dev @typescript-eslint eslint-plugin @typescript-eslint/parser eslint eslint-config-prettier eslint-plugin-import eslint-plugin-prettier prettier
```

### File: tsconfig.json add below this two line inside first object

```javascript
"include": ["./src/**/*.tsx", "./src/**/*.ts"],
"exclude": ["node_modules", "test/**/*.ts"]
```

### In root dir make a file call eslint.config.mjs and Past this initialize configuration eslint.config.mjs anytime we can change the configuration what we want

```javascript
import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ['**/*.{js,mjs,cjs,ts}'] },
  { languageOptions: { globals: globals.node } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ignores: ['node_modules', 'dist'],
    rules: {
      'no-unused-vars': 'error',
      'no-unused-expressions': 'error',
      'prefer-const': 'error',
      'no-console': 'warn',
      'no-undef': 'error',
    },
  },
];

```
### In .prettierrc.json file paste this to initialize configuration with prettier 

```javascript
{
    "semi": true,
    "singleQuote": true
}
``` 

### In .eslintignore file paste this to Ignore linting this folder

```javascript
node_modules;
dist;
```

### In .prettierignore file paste this to Ignore linting this folder

```javascript
node_modules;
dist;
```

# step-5: Configuration the package.json with script

### Main destination change that

```javascript
"main": "./dist/server.js",
```

### Make the script for running project locally, build project, lint all file, fix problem using lint, and format code using prettier.

```javascript
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start:dev": "ts-node-dev --respawn --transpile-only src/server.ts",
    "start:prod": "node ./dist/server.js",
    "build": "tsc",
    "lint": "node ./node_modules/eslint/bin/eslint.js . --fix",
    "lint:fix": "node ./node_modules/eslint/bin/eslint.js . --fix",
    "prettier": "prettier --ignore-path .gitignore --write \"./src/**/*.+(js|ts|json)\"",
    "prettier:fix": "npx prettier --write src",
    "format": "npx prettier --write \"./src/**/*.ts\""
  },
```

# step-6: Run project locally

### Prerequisites:
Node.js (v14.x or higher)
MongoDB (local or cloud instance)


### step-6.1 Clone the repository

```javascript
 https://github.com/ZakiaSultana4/BlogBuilder-A3.git

```

### step-6.2 Make a folder called BlogBuilder:

```javascript
cd BlogBuilder 
```

### step-6.3 Create a .env file with the following:

```javascript
  DB_URL=<DB_URL>
  SERVER_PORT=5000
  NODE_ENV=development
  BCRYPT_SALT_ROUNDS=<BCRYPT_SALT_ROUNDS>
  JWT_ACCESS_SECRET=<JWT_ACCESS_SECRET>
  JWT_REFRESH_SECRET=<JWT_REFRESH_SECRET>
  JWT_ACCESS_EXPIRES_IN=<JWT_ACCESS_EXPIRES_IN>
  JWT_REFRESH_EXPIRES_IN=<JWT_REFRESH_EXPIRES_IN>
```
### step-6.4 Install dependencies:

```javascript
npm install 
```

### step-6.5 Run eslint:

```javascript
npm run lint
```

### step-6.6 Run prettier:

```javascript
npm run format
```

### step-6.7 Build project:

```javascript
npm run build
```

### step-6.8 Run javascript file:

```javascript
npm run start:prod
```

### step-6.9 Run locally typescript file:

```javascript
npm run start:dev
```
### step-6.10 Access the application:

```javascript
http://localhost:5000
```
