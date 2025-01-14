// serve http

const fs = require("fs");
const http = require("http");
const utils = require("./utils");

const {
	serveFs,
} = require("./www");

const port = process.env.PORT || 8000;

const pages = {
	"/": () => require("./doc"),
	"/guide": () => require("./guide"),
	"/examples": () => require("./examples"),
};

const server = http.createServer((req, res) => {

	try {

		const path = req.url.split("?")[0];

		for (const target in pages) {
			if (path === target) {
				const content = pages[target]();
				res.setHeader("Content-Type", "text/html; charset=utf-8");
				res.writeHead(200);
				res.end(content);
				return;
			}
		}

		const versions = fs
			.readdirSync("lib")
			.filter(p => !p.startsWith("."))
			;

		const latestVer = versions.reduce(utils.cmpSemVer);

		if (path === "/versions") {
			res.setHeader("Content-Type", "application/json");
			res.setHeader("Access-Control-Allow-Origin", "*");
			res.writeHead(200);
			res.end(JSON.stringify([ ...versions, "dev", ]));
			return;
		}

		if (path === "/latest") {
			res.setHeader("Content-Type", "application/json");
			res.setHeader("Access-Control-Allow-Origin", "*");
			res.writeHead(200);
			res.end(JSON.stringify(latestVer));
			return;
		}

		serveFs("/pub", "pub")(req, res);
		serveFs(`/lib`, `lib`)(req, res);
		serveFs("/lib/latest", `lib/${latestVer}`)(req, res);
		serveFs("/lib/dev", "../src")(req, res);
		// TODO: deprecate
		serveFs("/lib/master", "lib/0.0.0")(req, res);

		if (res.finished) {
			return;
		}

		res.setHeader("Content-Type", "text/plain");
		res.writeHead(404);
		res.end("nope");

	} catch (e) {

		console.error(e);
		res.setHeader("Content-Type", "text/html; charset=utf-8");
		res.writeHead(500);
		res.end(`<pre>${e.stack}</pre>`);

	}

});

for (const target in pages) {
	console.log(`http://localhost:${port}${target}`);
}

server.listen(port);
