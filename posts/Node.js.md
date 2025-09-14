---
title: "Notes on Node.js"
date: "2025-04-14"
excerpt: ""
tags: ["Notes", "Tech"]
author: "Ed"
---

## Intro

Technically not a JS framework, but instead a runtime env., which makes it possible to run JS code outside of a browser, e.g. anywhere on a computer, like your terminal or vscode :)

### REPL

Short for Read, Eval, Print, Loop, which essentially means the `node` command line interface.

## Express

A genuine back-end framework.

According to my own understanding, it's yet another layer of abstraction on top of Node.js, which basically makes it the real framework.

### Middleware

4 types:

1. Logging
2. Pre-processing
3. Error detecting
4. Authenticating

Order of middleware's appearance in the code is important in Express, e.g. you may wanna authenticate before pre-processing anything. And the orders are specified by calling `next()` at the end of each middleware.

### Route Handlers

```JS
app.get();
app.post();
// ...
```

## EJS

First of all, fuck EJS.

### Tags

```EJS
<%- %>
```

is used for unescaped HTML output. The difference between `<%= %>` and `<%- %>` is:

- `<%= %>` outputs the value with HTML escaping (converts characters like `<`, `>`, `&`, etc. to their HTML entities)
- `<%- %>` outputs the value without HTML escaping (raw HTML)

!!!You would use `<%- %>` when you want to include HTML content that's stored as a **string** variable. For example:

```EJS
<% const htmlContent = "<p>This is <strong>HTML</strong> content</p>"; %>
<%- htmlContent %>
// or just
<% "<p>This is <strong>HTML</strong> content</p>" %>
```

On top of that, this type of tag can also be used for componentization:

```EJS
<%- include("header.ejs") %>
// ...
<%- include("footer.ejs") %>
```

However, IMO this is fake componentization and the sole effect is to simplify the code, since there's no "reuse", you still have to re-render those components like header and footer every time you change the route.

### Reference error

Unlike JS, EJS as a templating language, when it encounters an undefined var, it will crush instead of skip it, e.g. in the below case, if `fName` is undefined, then the whole website rendered from EJS will just break:

```EJS
<% if (fName) { %>
// ...
<% { %}
```

However, this can be dealt with via `res.locals`:

```EJS
<% if (locals.fName) { %>
// ...
<% { %}
```

Which can be defined either explicitly or implicitly in JS:

```JS
app.get("/", (req, res) => {
	// either explicitly
	res.locals = {
		fName: req.body["fName"],
	};
	res.render("index.ejs");
	// or implicitly
	res.render("index.ejs", {
		fName: req.body["fName"],
	});
})
```

## API

### RESTful

> **REST** (**Re**presentational **S**tate **T**ransfer) is a [software architectural style](https://en.wikipedia.org/wiki/Software_architectural_style "Software architectural style") that was created to describe the design and guide the development of the architecture for the [World Wide Web](https://en.wikipedia.org/wiki/World_Wide_Web "World Wide Web").

What makes an API RESTful?

1. Standard HTTP methods: GET/POST/PUT/PATCH/DELETE
2. Standard output format: JSON/XML
   1. The 'Representational'
3. Client-server separation
   1. Allows each side to scale independently
4. Statelessness: every req/res is complete in terms of the context
   1. Again, scalability
   2. Simplifies server-side implementation
5. Resource-based (Universal Resource Identifier/Locator)

### Hostname

`/baseURL`

### Endpoint

`/baseURL/someEndpoint`

Endpoints are basically different routes/paths on the API provider server.

### Params

#### Query

`/baseURL/someEndpoint?someKey=someValue&anotherKey=anotherValue`

Basically key-value pairs appended by ampersands, used for searching, sorting and filtering.

#### Path

`/baseURL/someEndpoint/somePath`

For identifying some resource.

### JSON

JavaScript Object Notation.

The key diff. between JSON and a genuine JS object is that the former is serialized into a string, whereas the latter has a more relaxed structure since it can be interpreted by the interpreter.

This behavior of serialization is to minimize the size of JSON, for it to be efficiently transferred across the internet.

```JSON
{
	"doors": 2,
	"color": "red",
}
// after serialization, it will actually look like:
// '[{"doors": 2,"color": "red",}]'
```

```JS
const wardrobe = {
	doors: 2,
	color: "red",
};
```

The transform between a JS object and a JSON:

```JS
const jsonWardrobe = JSON.stringify(wardrobe);
const notJsonWardrobe = JSON.parse(jsonWardrobe);
```

### Authentication/Authorization

What's the diff. between authorization and authentication anyway?

The former is when an API provider authorizes access to some service to an user, whereas the latter is when an user proves his identity to the API provider.

(But seriously, who cares?)

#### No auth.

The only way to prevent abuse in this case is to set up a rate limit based on IP.

#### Basic authentication

Encode `username:password` into BASE64, then embed it into the request header.

#### API Key authorization

You know the drill.

#### Token authentication

Sigh in first, then get hold of a token generated and returned by the server.

This resort highly reduces the risk of username/password being exposed. Plus it brings in the benefit of expiration mechanism.

## Authentication

### Encoding

The easiest way: Caesar Cipher, simply shifting each letter by `n`.

Hashing: nearly impossible to decode, because it would take enormous time. And in practical, we do not really decode/reverse a hash. So essentially, hashing is just a way of _disguising_ credential info, e.g. user passwords. The only person that knows this info, is user itself.

Salting: append random chars at the end of the original info before inputing it to the hash func.

### bcrypt

## Env vars

### why bother?

1. convenience: altering some vars without touching the codebase, such as port number, encryption key, API key, etc.
2. security: it is dangerous to hard-code those keys in your code and upload them to the cloud.

Env vars enable us to separate those sensitive vars from all the other code.

### how it works?

Firstly, create a file named `.env` (yes without filename, only an extension) at the top level of your codebase.

```
SOME_ENV_VAR="lmao"
YET_ANOTHER_ENV_VAR="lol"
```

And then, with one simple configuration/initialization, you're good to go!

```js
import env from "dotenv";
env.config();
const tmp = process.env.SOME_ENV_VAR;
```

## Myths

### Promise?

`async await`
v.s.
`.get .then .finally`

`async await` as a more modern approach, makes your async JS code look more like sync code. (although I don't get the point)

Callback?
