## PROJECT SETUP AND INSTALLATION INSTRUCTIONS:

## Initialize a package.json file

- npm init -y

## Install Dependencies and Development Dependencies

- npm i express mongoose multer ts-node @google-cloud/storage dotenv
- npm i -D @types/express @types/node typescript nodemon

## Create a dist and src folder in the root directory

- mkdir dist
- mkdir src

## Initialize the tsconfig.json file

- npx tsc --init

## Edit the configurations to the following

- "compilerOptions": {/* Language and Environment */
-      "target": "es2016",                                  /* Set the JavaScript language version for emitted JavaScript and include compatible library declarations. */
      /* Modules */
      "module": "commonjs",                                /* Specify what module code is generated. */
      "rootDir": "./src",                                  /* Specify the root folder within your source files. */
      "outDir": "./dist",                                   /* Specify an output folder for all emitted files. */
      "esModuleInterop": true,                             /* Emit additional JavaScript to ease support for importing CommonJS modules. This enables 'allowSyntheticDefaultImports' for type compatibility. */
      "forceConsistentCasingInFileNames": true,            /* Ensure that casing is correct in imports. */
      /* Type Checking */
      "strict": true,                                      /* Enable all strict type-checking options. */
      "noImplicitAny": true,                            /* Enable error reporting for expressions and declarations with an implied 'any' type. */
      "strictNullChecks": true,                         /* When type checking, take into account 'null' and 'undefined'. */
      "strictFunctionTypes": true,                      /* When assigning functions, check to ensure parameters and the return values are subtype-compatible. */
      "skipLibCheck": true
 }
 

## Build the index javascript file used for production

- npx tsc --build

## Launch the server (after writing the server code in src/index.ts)

- node ./dist/index.js

## Automate the scripts in package.json file

- "scripts": {
  "test": "echo \"Error: no test specified\" && exit 1",
  "build": "tsc --build",
  "start": "node ./dist/index.js",
  "start:dev": "nodemon ./src/index.ts"
  }

## Relaunch the server:

- npm run start:dev

# DESCRIPTION OF THE API ENDPOINTS AND THEIR EXPECTED INPUTS/OUTPUTS:

## Create a Book:
- Endpoint: `POST /books`
- Accept a request body containing the book details (title, author, published date, ISBN).
- Validate the input data.
- Save the validated data in the database.
- Return a structured response containing the created book object with a unique ID.

## Update Book Cover Picture:
- Endpoint: `PATCH /books/cover-image/:id`
- Update the cover picture of the book with the specified ID.
- Return the updated book object.
- Handle the case where the book ID does not exist.

## Get All Books:
- Endpoint: `GET /books`
- Return a structured response containing a list of all books in the collection.

## Get a Single Book:
- Endpoint: `GET /books/:id`
- Return the details of the book with the specified ID.
- Handle the case where the book ID does not exist.

## Update a Book:
- Endpoint: `PUT /books/:id`
- Update the details of the book with the specified ID based on the request body.
- Return the updated book object.
- Handle the case where the book ID does not exist.

## Delete a Book:
- Endpoint: `DELETE /books/:id`
- Remove the book with the specified ID from the collection.
- Return a confirmation message.
- Handle the case where the book ID does not exist.

# How to Run the application and test the endpoints.

## Prerequisites
* Node.js and npm (or yarn) installed
* MongoDB database running

## Running the Application
1. **Clone the repository:**
- git clone [https://github.com/dpthenicest/Books-Api.git](https://github.com/dpthenicest/Books-Api.git)

2. **Navigate to the project directory:**
- cd Books-Api

3. **Set environment variables: (.env)**
- DATABASE_URL=mongodb://localhost:27017/yourDatabase
- PORT=5000

4. **Install Dependencies:**
- npm install

5. **Start the application:**
- npm start

## Testing the endpoints in Postman

1. Install Jest and TS-Jest.
- npm i -D jest ts-jest @types/jest


