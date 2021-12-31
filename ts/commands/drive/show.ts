import { Err, GetDriveData, ResolvePath } from "../../utils";

export const command: Command = {
  description: "Shows a file.",
  name: "show",
  syntax: "show {path}",
  run: async function (client, message, args) {
    const drive = await GetDriveData(message.channel.id);

    if (!args[1]) throw new Err("Please provide a path!", "missing-argument");

    let path = ResolvePath(drive, args[1], true)
      .split("/")
      .filter((dir) => dir);

    let obj = drive.fs["/"];
    for (let dir of path) {
      obj = obj[dir];
    }

    if (obj.type == "folder")
      throw new Err("This file does not exist!", "invalid-file");

    const msg = await message.channel.messages.fetch(obj.messageId).catch();

    if (msg) {
      // @ts-ignore
      message.reply({ files: [msg.attachments.first()?.attachment] });
    } else {
      message.reply("The original message has been deleted.");
    }
  },
};
