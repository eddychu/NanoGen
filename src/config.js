const fs = require("fs");
const YAML = require("yaml");
const configYamlPath = "config.yml";

function getConfig() {
  let content = fs.readFileSync(configYamlPath, "utf-8");
  return YAML.parse(content);
}

module.exports = {
  getConfig,
};
