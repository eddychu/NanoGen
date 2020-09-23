const fs = require("fs-extra");
const path = require("path");
const DEFAULTS = require("./default");
const marked = require("marked");
const frontMatter = require("front-matter");

function normalizePost(post) {
  return { body: post.bodyHTML, slug: post.slug, ...post.attributes };
}
class Collector {
  constructor(ctx) {
    this.ctx = ctx;
    this.cache = [];
  }
  async getPosts() {
    let posts = await fs.readdir(DEFAULTS.contentPath);
    posts.filter((post) => {
      return path.extname(post) === ".md";
    });
    let finalPosts = await Promise.all(posts.map(this.getPost.bind(this)));
    this.cache = finalPosts;
    return finalPosts;
  }

  async getPost(post) {
    let fullPath = path.resolve(DEFAULTS.contentPath, post);
    let raw = await fs.readFile(fullPath, "utf8");
    let parsed = frontMatter(raw);
    parsed.bodyHTML = marked(parsed.body);
    parsed.slug = post.slice(0, -3);
    return normalizePost(parsed);
  }

  isInCache(slug) {
    console.log(this.cache);
    let index = this.cache.findIndex((post) => {
      console.log(post.slug);
      return post.slug === slug;
    });
    console.log(index);
    return index > -1;
  }
}

module.exports = Collector;
