const fs = require("fs-extra");
const path = require("path");
const marked = require("marked");
const frontMatter = require("front-matter");
const nunjucks = require("nunjucks");

const buildConfig = {
  templatePath: "templates",
  outputPath: "public",
  contentPath: "contents",
};

const siteConfig = {
  author: "Eddy Chu",
  title: "Eddy Chu",
  description: "A personal blog",
  keywords: ["blog", "programming", "learning", "javascript", "react"].join(
    ","
  ),
};

const env = new nunjucks.Environment(
  new nunjucks.FileSystemLoader("templates"),
  { autoescape: false }
);

env.addGlobal("site", siteConfig);

async function getPosts() {
  let posts = await fs.readdir(buildConfig.contentPath);
  posts.filter((post) => {
    return path.extname(post) === ".md";
  });
  return await Promise.all(posts.map(getPost));
}

async function getPost(post) {
  let fullPath = path.resolve(buildConfig.contentPath, post);
  let raw = await fs.readFile(fullPath, "utf8");
  let parsed = frontMatter(raw);
  parsed.bodyHTML = marked(parsed.body);
  parsed.slug = post.slice(0, -3);
  return normalizePost(parsed);
}

function normalizePost(post) {
  return { body: post.bodyHTML, slug: post.slug, ...post.attributes };
}

async function buildPost(post) {
  let output = env.render("single.njk", { post });
  let outputPath = path.resolve(buildConfig.outputPath, post.slug + ".html");
  await fs.outputFile(outputPath, output);
  console.log("created file ", outputPath);
}

async function buildPosts(posts) {
  return await Promise.all(posts.map(buildPost));
}

async function buildIndex(posts) {
  let output = env.render("index.njk", { posts });
  let outputPath = path.resolve(buildConfig.outputPath, "index.html");
  await fs.outputFile(outputPath, output);
  console.log("created file ", outputPath);
}

async function buildStatic() {
  let source = path.resolve(buildConfig.templatePath, "static");
  let destination = path.resolve(buildConfig.outputPath, "static");
  await fs.copy(source, destination);
  console.log("copy static files to public folder");
}

function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

async function create(slug) {
  let title = slug.split("-").map(capitalize).join(" ");
  let defaultMarkdownTemplate = `---
title: ${title}
created: ${new Date()}
---`;
  let fullPath = path.resolve(buildConfig.contentPath, slug + ".md");
  await fs.outputFile(fullPath, defaultMarkdownTemplate);
  console.log("created new file ", fullPath);
}

async function test() {
  //   await fs.remove(buildConfig.outputPath);
  //   let posts = await getPosts();
  //   await buildIndex(posts);
  //   await buildPosts(posts);
  //   await buildStatic();

  await create("good-bye");
}

test();
