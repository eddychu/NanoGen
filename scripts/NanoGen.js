import NanoFiles from "./NanoFiles.js";
import fs from "fs-extra";

class NanoGen {
  constructor() {
    this.files = new NanoFiles();
    this.documents = [];
  }

  async create() {
    try {
      console.log("test");
      await fs.ensureDir(this.files.contentFolder);
      await fs.ensureDir(this.files.templateFolder);
      await fs.ensureDir(this.files.outputFolder);
      console.log("start hacking now!");
    } catch (err) {
      console.error(err);
    }
  }
}

let nanoGen = new NanoGen();
nanoGen.create();
