const fs = require("fs-extra");
const path = require("path");
const DEFAULTS = require("./default");
const marked = require("marked");
const frontMatter = require("front-matter");

function normalizePost(post) {
  let normalized = {
    body: post.bodyHTML,
    slug: post.slug,
    ...post.attributes,
  };
  if (normalized.category) {
    normalized.category = getCategory(normalized.category);
  }
  return normalized;
}

function getCategory(categoryString) {
  return categoryString.split(",").map((item) => item.trim());
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

  getAllCategories() {
    let categories = [];
    for (let post of this.cache) {
      if (post.category) {
        categories = categories.concat(post.category);
      }
    }

    return categories.filter(
      (item, index) => categories.indexOf(item) === index
    );
  }

  getPostsByCatetory(category) {
    return this.cache.filter((post) => {
      return post.category && post.category.indexOf(category) > -1;
    });
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
    let index = this.cache.findIndex((post) => {
      return post.slug === slug;
    });
    return index > -1;
  }
}

module.exports = Collector;
