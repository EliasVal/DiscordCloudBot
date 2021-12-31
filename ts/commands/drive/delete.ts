import { GetDriveData, ResolvePath, WriteDriveData, Err } from "../../utils";

export const command: Command = {
  description: "Deletes a file or a folder",
  name: "delete",
  syntax: "delete {path}",
  run: async function (client, message, args) {
    const drive = await GetDriveData(message.channel.id);

    if (!args[1]) throw new Err("Please provide a path!", "missing-argument");

    let resolvedPath = ResolvePath(drive, args[1], true);

    if (resolvedPath == "/")
      throw new Err("Cannot delete root!", "root-delete-attempt");

    let path = resolvedPath.split("/").filter((dir) => dir);

    const pathHead = path.pop();

    let obj = drive.fs["/"];
    for (let dir of path) {
      obj = obj[dir];
    }

    if (obj[pathHead].type == "file") {
      const msg = await message.channel.messages
        .fetch(obj[pathHead].messageId)
        .catch();
      msg && msg.delete();
    }
    delete obj[pathHead];

    await WriteDriveData(message.channel.id, drive);

    message.reply(`Successfully deleted \`${resolvedPath}\``);
  },
};
