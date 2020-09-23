const renderer = require("./renderer");
const Collector = require("./collector");
const Builder = require("./builder");
const { getConfig } = require("./config");
const Renderer = require("./renderer");
class NanoGen {
  constructor() {
    this.collector = new Collector(this);
    this.builder = new Builder(this);
    this.renderer = new Renderer(this);
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
}

module.exports = NanoGen;
