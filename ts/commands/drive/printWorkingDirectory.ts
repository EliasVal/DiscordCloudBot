import { GetDriveData } from "../../utils";

export const command: Command = {
  description: "Prints current working directory",
  name: "print-working-directory",
  aliases: ["pwd"],
  syntax: "print-working-directory",
  run: async function (client, message, args) {
    const drive = await GetDriveData(message.channel.id);
    message.reply(`Current working directory: \`${drive.cwd}\``);
  },
};
