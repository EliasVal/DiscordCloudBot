import { GetDriveData } from "../../utils";

export const command: Command = {
  description: "Prints current working directory",
  name: "print-working-directory",
  aliases: ["pwd"],
  run: async function (client, message, args) {
    const file = await GetDriveData(message.channel.id);
    message.reply(`Current working directory: \`${file.cwd}\``);
  },
};
