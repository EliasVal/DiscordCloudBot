import { GetDriveData, ResolvePath, WriteDriveData } from "../../utils";

export const command: Command = {
  description: "Changes the current working directory",
  name: "change-directory",
  aliases: ["cd"],
  syntax: "change-directory {path}",
  run: async function (client, message, args) {
    const drive = await GetDriveData(message.channel.id);
    drive.cwd = ResolvePath(drive, args[1]);
    await WriteDriveData(message.channel.id, drive);
    message.reply(`Set current working directory to \`${drive.cwd}\``);
  },
};
