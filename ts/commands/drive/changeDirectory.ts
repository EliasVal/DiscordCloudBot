import { GetDriveData, WriteDriveData } from "../../utils";

export const command: Command = {
  description: "Changes the current working directory",
  name: "change-directory",
  aliases: ["cd"],
  run: async function (client, message, args) {
    const drive = await GetDriveData(message.channel.id);

    let desiredDir = args[1].split(/\/+/);
    if (args[1].startsWith("/")) desiredDir.unshift("/");

    // Remove empty elements
    desiredDir = desiredDir.filter((dir) => dir);

    if (args[1].startsWith("/")) {
      while (desiredDir.indexOf("..") != -1) {
        desiredDir.splice(desiredDir.indexOf("..") - 1, 2);
      }
      if (desiredDir.indexOf("/") == -1) {
        await message.reply("You cannot go back any futher than root!");
        return;
      }
    } else {
      desiredDir = ["/", ...drive.cwd.split("/"), ...desiredDir];

      // Remove empty elements
      desiredDir = desiredDir.filter((dir) => dir);

      while (desiredDir.indexOf("..") != -1) {
        desiredDir.splice(desiredDir.indexOf("..") - 1, 2);
      }
      if (desiredDir.indexOf("/") == -1) {
        await message.reply("You cannot go back any futher than root!");
        return;
      }
    }

    let obj = drive.fs;

    // Remove empty elements
    desiredDir = desiredDir.filter((dir) => dir);

    // "CD" into Current Working Directory
    for (let dir of desiredDir) {
      // @ts-ignore
      obj = obj[dir];

      if (obj == null || obj.type == "file") {
        const msg = await message.reply("This directory doesn't exist!");
        setTimeout(() => {
          msg.delete();
          message.delete();
        }, 5000);
        return;
      }
    }

    drive.cwd = desiredDir.join("/").replace(/\/+/g, "/");

    await WriteDriveData(message.channel.id, drive);
    message.reply(`Set current working directory to \`${drive.cwd}\``);
  },
};
