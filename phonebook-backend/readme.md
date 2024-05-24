# Node.js and Express

IN this part is just solely the back-end part.

We will build our backend on top of NodeJS, which is a JavaScript runtime based on Google's Chrome V8 JavaScript engine.

Browsers don't yet support the newest features of JavaScript, and that is why the code running in the browser must be transpilled with e.g. babel. The situation with JavaScript running in the backend is different. The newest version of Node supports a large majority of the latest features of JavaScript. so we can use the latest features without having to transpile our code.

Our goal is to implement a backend that will work with the notes appplication from part 2. However, let's start with the basics by implenting a classic "hello world" application.

We had already mentioned npm back in part2, which is a tool for used for managing JavaScript packages. In fact, npm originates from the Node ecosystem,

Let's go for the appropriate directory, and we have to create the appropriate template for our application with the npm init command.

After, we will answer the questions presented by the utility, and the result will be an automatically generated package.json file at the root of the project that contains information about the project.

Even though the execution of the project works when it is started by calling node index.js from the commmand line, it's customary for npm projects to execute such tasks as npm scripts.

By default, the package.json file also defines another comonly used script called npm test. Since our project does not yet have a testing library, the npm test comand:

```
echo "Error: no test specidfied " && exit 1
```

# Simple web server

Let's change  the application into a web server by editing the index.js file as follows:

```
const http = require('http')

const app = http.createServer((request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/plain })
  response.end('Hello Man')
})



```

Lets look

```
const http = require('http')
```

In the firt row, the application imports Node's built-in web server module. This is practically what we have already been doing in our browser-side code, but with different syntax

```
import http from 'http'

```

These days, code that runs in the browser use ES6 modules. Modules are defined an export and included in the current with an import.

Node.js uses CommonJS modules. The reason for this is that the Node ecosystem needed modules long before JavaScript supported them in the language specification. Currently, Node also supports the use of ES& modules, but since the suppor is not quite perfect yet, we'll stick to CommonJS modules.

CommonJS modules function almost exactly like ES6 modules, at least as far as our needs in this course are concerned.

The next chunk in our code look like this

```
const app = http.createServer((request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/plain' })
  response.end('Hello World')
})
```

The code uses the createServer method of the http module to create a new web server. An event handler is registered to the server that is called every time an HTTP request is made to the server's address hhtp;//localhost:3001.

The request is responded to with the sratus code 200, with the Content-Type header set to text/plain, and the content of the site to be returned set to Hello World.

The last rows bind the http server assigned to the app variable, to listen to HTTP request sent to port 3001

```
const PORT = 3001
app.listen(port)
console.log(`Server running on port ${PORT}`)
```

The primary purpose of the backend server in this course is to offer raw data in JSON format to the frontend. For this reason, let's immediately change our server to return a hardcoded list of notes in the JSON format:

- notes format in JSON

Let's restart the server (you can shut the server down by pressing *Ctrl+C* in the console) and let's refresh the browser.

The *application/json* value in the *Content-Type* header informs the receiver that the data is in the JSON format. The *notes* array gets transformed into JSON formatted string with the *JSON.stringify(notes)* method. This is necessary because the response.end() method expects a string or a buffer to send as the response body.

When we open the browser, the displayed format is exactly the same as in [part 2](https://fullstackopen.com/en/part2/getting_data_from_server/) where we used [json-server](https://github.com/typicode/json-server) to serve the list of notes:

![formatted JSON notes data](https://fullstackopen.com/static/b724a971f214d33e59fa91241517dea3/5a190/2new.png)

### Express

....

Let's take Express into use by defining it as project dependency with the command

```bash
npm install expresscopy
```

The dependency is also added to our *package.json* file:

```json
{
  // ...
  "dependencies": {
    "express": "^4.18.2"
  }
}copy
```

The source code for the dependency is installed in the *node\_modules* directory located at the root of the project. In addition to Express, you can find a great number of other dependencies in the directory:

![ls command listing of dependencies in directory](https://fullstackopen.com/static/da4cca859c66e0bf7d064455a105ad49/5a190/4.png)

These are the dependencies of the Express library and the dependencies of all of its dependencies, and so forth. These are called the [transitive dependencies](https://lexi-lambda.github.io/blog/2016/08/24/understanding-the-npm-dependency-model/) of our project.

Version 4.18.2 of Express was installed in our project. What does the caret in front of the version number in *package.json* mean?

```json
"express": "^4.18.2"copy
```

The versioning model used in npm is called [semantic versioning](https://docs.npmjs.com/about-semantic-versioning).

The caret in the front of *^4.18.2* means that if and when the dependencies of a project are updated, the version of Express that is installed will be at least *4.18.2*. However, the installed version of Express can also have a larger *patch* number (the last number), or a larger *minor* number (the middle number). The major version of the library indicated by the first *major* number must be the same.

We can update the dependencies of the project with the command:

```bash
npm updatecopy
```

Likewise, if we start working on the project on another computer, we can install all up-to-date dependencies of the project defined in *package.json* by running this next command in the project's root directory:

```bash
npm installcopy
```

If the *major* number of a dependency does not change, then the newer versions should be [backwards compatible](https://en.wikipedia.org/wiki/Backward_compatibility). This means that if our application happened to use version 4.99.175 of Express in the future, then all the code implemented in this part would still have to work without making changes to the code. In contrast, the future 5.0.0 version of Express [may contain](https://expressjs.com/en/guide/migrating-5.html) changes that would cause our application to no longer work.


### Web and Express

Let's get back to our application and make the following changes:

```js
const express = require('express')
const app = express()

let notes = [
  ...
]

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/notes', (request, response) => {
  response.json(notes)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})copy
```

To get the new version of our application into use, first we have to restart it.

The application did not change a whole lot. Right at the beginning of our code, we're importing *express*, which this time is a *function* that is used to create an Express application stored in the *app* variable:

```js
const express = require('express')
const app = express()copy
```

Next, we define two *routes* to the application. The first one defines an event handler that is used to handle HTTP GET requests made to the application's */* root:

```js
app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})copy
```

The event handler function accepts two parameters. The first [request](http://expressjs.com/en/4x/api.html#req) parameter contains all of the information of the HTTP request, and the second [response](http://expressjs.com/en/4x/api.html#res) parameter is used to define how the request is responded to.

In our code, the request is answered by using the [send](http://expressjs.com/en/4x/api.html#res.send) method of the *response* object. Calling the method makes the server respond to the HTTP request by sending a response containing the string `<h1>Hello World!</h1>` that was passed to the *send* method. Since the parameter is a string, Express automatically sets the value of the *Content-Type* header to be *text/html*. The status code of the response defaults to 200.

We can verify this from the *Network* tab in developer tools:

![network tab in dev tools](https://fullstackopen.com/static/db016b053153eda01c97cbc69270f934/5a190/5.png)

The second route defines an event handler that handles HTTP GET requests made to the *notes* path of the application:

```js
app.get('/api/notes', (request, response) => {
  response.json(notes)
})copy
```

The request is responded to with the [json](http://expressjs.com/en/4x/api.html#res.json) method of the *response* object. Calling the method will send the **notes** array that was passed to it as a JSON formatted string. Express automatically sets the *Content-Type* header with the appropriate value of *application/json*.

![api/notes gives the formatted JSON data again](https://fullstackopen.com/static/4047d2049a560c6eecab5f91754b5bb2/5a190/6new.png)

Next, let's take a quick look at the data sent in JSON format.

In the earlier version where we were only using Node, we had to transform the data into the JSON formatted string with the *JSON.stringify* method:

```js
response.end(JSON.stringify(notes))copy
```

With Express, this is no longer required, because this transformation happens automatically.

Midleware is a function that receives 3 parameters(request, response, next).

const requestLogger = (request, response, next ) => {
  console.log('Method', request.method)..
  ....
  ...
  next()
}
At the end of the function body, the next function that was passed as a parameter is called. The next function yields control to the next middleware.

Middleware is used like this

app.use(requestLogger)

Remember, middleware functions are called in the order that they're encountered by the JavaScript engine. Notice that json-parser is listed before requestLogger because otherwise request.body will not be initialized when the logger is executed!

Middleware functions have to be used before routes when we want them to be executed by the route event handlers. Sometimes, we want to use midldleware functions after routes. We do this when the midldleware functions are only called if no route handler processes the HTTP request.

Let's add the following midlewareafter our routes. This middleware will be used for catching requests made to no-existing routes. For these requets, the midleware will return an error message in the JSON format.

```
const unknown = (request, response) => {
  response.status(404).send({error: 'unknown endpoint' })
}

app.use(unknownEndpoint)