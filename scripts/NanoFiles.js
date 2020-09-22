const DEFAULT = {
  CONTENT: "contents",
  TEMPLATE: "templates",
  OUTPUT: "public",
};

export default class NanoFiles {
  constructor(_in, _temp, _out) {
    this.contentFolder = _in || DEFAULT.CONTENT;
    this.templateFolder = _temp || DEFAULT.TEMPLATE;
    this.outputFolder = _out || DEFAULT.OUTPUT;
  }
}
