const { Command } = require("commander");
const NanoGen = require("./nanogen");

const program = new Command();
const nanoGen = new NanoGen();

program
  .version("0.0.1")
  .command("new <slug>")
  .action(async function (slug) {
    await nanoGen.collect();
    await nanoGen.create(slug);
  });
program.command("serve").action(async function () {
  await nanoGen.watch();
});

program.parse(process.argv);
