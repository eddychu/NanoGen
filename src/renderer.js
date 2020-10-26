const nunjucks = require("nunjucks");
const DEFAULTS = require("./default");

class Renderer {
  constructor(ctx) {
    this.ctx = ctx;
    this.nunjucks = new nunjucks.Environment(
      new nunjucks.FileSystemLoader(DEFAULTS.templatePath),
      { autoescape: false,
        noCache: true,
        watch: true,
      }
    );
  }

  addConfig(name, config) {
    this.nunjucks.addGlobal(name, config);
  }

  render(file, obj) {
    return this.nunjucks.render(file, obj);
  }
}

module.exports = Renderer;
