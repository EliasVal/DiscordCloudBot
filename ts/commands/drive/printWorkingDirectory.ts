import { readFileSync } from "fs";

export const command: Command = {
  description: "Prints current working directory",
  name: "print-working-directory",
  aliases: ["pwd"],
  run: async function (client, message, args) {
    const file = JSON.parse(
      await readFileSync(
        `${global.appRoot}/data/${message.channel.id}.json`
      ).toString()
    );
    message.reply(`Current working directory: \`${file.cwd}\``);
  },
};
