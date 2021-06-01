const DEFAULTS = require("./default");
const fs = require("fs-extra");
const path = require("path");
function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

class Creator {
  constructor(ctx) {
    this.ctx = ctx;
  }

  async create(slug) {
    let title = slug.split("-").map(capitalize).join(" ");

    let defaultMarkdownTemplate = `---
title: ${title}
created: ${new Date().toISOString()}
category: ${DEFAULTS.category}
---`;
    let fullPath = path.resolve(DEFAULTS.contentPath, slug + ".md");
    await fs.outputFile(fullPath, defaultMarkdownTemplate);
    console.log("created new file ", fullPath);
  }
}

module.exports = Creator;
