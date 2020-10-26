const express = require("express");
const chokida = require("chokidar");

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
    this.app.use(express.static(DEFAULTS.outputPath));
  }

  async serve() {
    await this.ctx.build();
    this.app.listen(port, () => {
      console.log(`Example app listening at http://localhost:${port}`);
    });
  }

  async close() {
    this.app.close();
  }

  async watch() {
    await this.serve();
    let watcher = chokida.watch(
      [DEFAULTS.contentPath, DEFAULTS.templatePath, "src"],
      {
        ignored: /(^|[\/\\])\../, // ignore dotfiles
        persistent: true,
      }
    );
    watcher.add(["../contents/**", "../templates/**"]);
    // var watchedPaths = watcher.getWatched();

    watcher.on("change", async () => {
      this.ctx.initTemplate();
      console.log("change template")
      this.ctx.build();
    
    });
  }
}

module.exports = Server;
