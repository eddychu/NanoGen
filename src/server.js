const express = require("express");
const DEFAULTS = require("./default");
const port = 3000;

async function start() {
  app.use(express.static("public"));

  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  });
}

class Server {
  constructor(ctx) {
    this.ctx = ctx;
    this.app = express();
  }

  serve() {
    this.app.use(express.static(DEFAULTS.outputPath));

    this.app.listen(port, () => {
      console.log(`Example app listening at http://localhost:${port}`);
    });
  }
}

module.exports = Server;
