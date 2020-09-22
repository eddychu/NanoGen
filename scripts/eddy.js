import fs from "fs-extra";
import nunjucks from "nunjucks";
import path from "path";
import marked from "marked";
import frontMatter from "front-matter";

const buildConfig = {
  templatePath: "templates",
  outputPath: "docs",
  contentPath: "contents",
};

const siteConfig = {
  author: "Eddy Chu",
  title: "Eddy Chu",
  description: "A personal blog",
  keywords: [
    "blog",
    "tech",
    "programming",
    "learning",
    "javascript",
    "react",
  ].join(","),
};

const defaultPageConfig = {
  title: "",
  description: "",
  keywords: [],
};

const env = new nunjucks.Environment(
  new nunjucks.FileSystemLoader("templates"),
  { autoescape: false }
);

env.addGlobal("site", siteConfig);

env.addGlobal("page", defaultPageConfig);

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

const getTypes = async () => {
  try {
    return await fs.readdir(buildConfig.contentPath);
  } catch (err) {
    console.error(err);
  }
};

const getPostsByType = async (type) => {
  try {
    let fullPath = path.resolve(buildConfig.contentPath, type);
    return await fs.readdir(fullPath);
  } catch (err) {
    console.error(err);
  }
};

const getMarkdownFile = async (slug, type) => {
  let fullPath = path.resolve("contents", type, slug, "index.md");

  try {
    return await fs.readFile(fullPath, "utf8");
  } catch (err) {
    console.error(err);
  }
};

const makeTypes = async () => {
  const types = await getTypes();
  let allPosts = await Promise.all(types.map(makeType));
  console.log(allPosts);
  return allPosts;
};

const makeType = async (type) => {
  const posts = await getPostsByType(type);
  let parsedPosts = await Promise.all(
    posts.map(async (post) => {
      return await makePostByType(post, type);
    })
  );
  return { type, posts: parsedPosts };
};

const makePostByType = async (post, type) => {
  let outputFile = path.resolve("public", "posts", post, "index.html");
  let rawMarkdown = await getMarkdownFile(post, type);
  let parsedMarkdown = frontMatter(rawMarkdown);
  let title = parsedMarkdown.attributes.title;
  let body = marked(parsedMarkdown.body);
  let keywords = parsedMarkdown.attributes.keywords
    ? parsedMarkdown.attributes.keywords.join(",")
    : "";
  let description = parsedMarkdown.attributes.description || "";
  let pageObj = {
    ...defaultPageConfig,
    title: title,
    keywords: keywords,
    description: description,
  };
  let postObj = { slug: post, title, body, type: "posts" };
  let finalHtml = env.render("single.njk", { post: postObj, page: pageObj });
  await fs.outputFile(outputFile, finalHtml);
  console.log("generate " + outputFile);
  return postObj;
};

const makeIndex = async (posts) => {
  await fs.outputFile(
    "public/index.html",
    env.render("index.njk", { posts, isHome: true })
  );
  console.log("generate public/index.html");
};

const makeSite = async () => {
  console.log("starting");

  const posts = await makeTypes();
  console.log(posts);
};

makeSite();
