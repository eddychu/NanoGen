const { Command } = require("commander");
const NanoGen = require("./nanogen");

const program = new Command();
const nanoGen = new NanoGen();

program.command("new <slug>").action(async function (slug) {
  await nanoGen.collect();
  await nanoGen.create(slug);
});

program.command("serve").action(async function () {
  await nanoGen.watch();
});

program.command("build").action(async function () {
  await nanoGen.build();
});

program.parse(process.argv);
