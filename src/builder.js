const fs = require("fs-extra");
const path = require("path");
const DEFAULTS = require("./default");

class Builder {
  constructor(ctx) {
    this.ctx = ctx;
  }
  async buildPost(post) {
    let output = this.ctx.renderer.render("single.njk", { post });
    let outputPath = path.resolve(DEFAULTS.outputPath, post.slug + ".html");
    await fs.outputFile(outputPath, output);
    console.log("created file ", outputPath);
  }

  async buildPosts(posts) {
    return await Promise.all(posts.map(this.buildPost.bind(this)));
  }

  async buildIndex(posts) {
    let output = this.ctx.renderer.render("index.njk", { posts });
    let outputPath = path.resolve(DEFAULTS.outputPath, "index.html");
    await fs.outputFile(outputPath, output);
    console.log("created file ", outputPath);
  }

  async buildCategories() {
    let categories = this.ctx.collector.getAllCategories();
    console.log(categories);
    await Promise.all(categories.map(this.buildCategory.bind(this)));
  }

  async buildCategory(category) {
    let posts = this.ctx.collector.getPostsByCatetory(category);
    let output = this.ctx.renderer.render("index.njk", { posts });
    let outputPath = path.resolve(DEFAULTS.outputPath, category + ".html");
    await fs.outputFile(outputPath, output);
    console.log("created file ", outputPath);
  }

  async buildStatic() {
    let source = path.resolve(DEFAULTS.templatePath, "static");
    let destination = path.resolve(DEFAULTS.outputPath, "static");
    await fs.copy(source, destination);
    console.log("copy static files to public folder");
  }

  async build(posts) {
    await this.buildIndex(posts);
    await this.buildPosts(posts);
    await this.buildCategories();
    await this.buildStatic();
    console.log("done");
  }
}

module.exports = Builder;
