import { listenAndServe } from "https://deno.land/std/http/server.ts";

const port = 3000;

listenAndServe({ port }, async (req) => {
  if (req.method === "GET" && req.url === "/") {
    req.respond({
      status: 200,
      headers: new Headers({
        "content-type": "text/html",
      }),
      body: await Deno.open("./index.html"),
    });
  }
});

console.log(`server is running at port ${port}`);
