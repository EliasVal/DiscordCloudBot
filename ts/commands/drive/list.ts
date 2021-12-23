import { readFileSync } from "fs";

export const command: Command = {
  description: "List all files in current working directory",
  name: "list",
  aliases: ["ls", "dir"],
  run: async function (client, message, args) {
    const file = JSON.parse(
      readFileSync(
        `${global.appRoot}/data/${message.channel.id}.json`
      ).toString()
    );

    let files = Object.keys(file.fs[file.cwd]);
    files = files.filter((f) => f != "type");

    console.log(files);
  },
};
