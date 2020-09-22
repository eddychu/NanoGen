const DEFAULT = {
  type: "posts",
};

class Document {
  constructor(_title, _type) {
    this.type = _type || DEFAULT.type;
    this.created = Date.now();
    this.updated = null;
    this.title = _title;
    this.tags = [];
    this.body = null;
  }
}



