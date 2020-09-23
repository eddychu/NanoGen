const Collector = require("./collector");
const Builder = require("./builder");
const { getConfig } = require("./config");
const Renderer = require("./renderer");
const Creator = require("./creator");
const Server = require("./server");
class NanoGen {
  constructor() {
    this.collector = new Collector(this);
    this.builder = new Builder(this);
    this.renderer = new Renderer(this);
    this.creator = new Creator(this);
    this.server = new Server(this);
    this.config = getConfig();
    this.renderer.addConfig("site", this.config);
  }

  async collect() {
    let posts = await this.collector.getPosts();
    return posts;
  }

  async build() {
    let posts = await this.collect();
    await this.builder.build(posts);
  }

  async create(slug) {
    console.log("creating");
    if (!this.collector.isInCache(slug)) {
      await this.creator.create(slug);
    } else {
      console.log("file already existed ", slug + ".md");
    }
  }

  async serve() {
    await this.server.serve();
  }

  async watch() {
    await this.server.watch();
  }
}

module.exports = NanoGen;
