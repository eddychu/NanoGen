const express = require("express");
const app = express();
const port = 3000;

async function start() {
  app.use(express.static("public"));

  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  });
}

start();
