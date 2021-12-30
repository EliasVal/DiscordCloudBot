import { GetDriveData, ResolvePath, WriteDriveData, Err } from "../../utils";

export const command: Command = {
  description: "Renames a file or a directory",
  name: "rename",
  aliases: ["rn"],
  syntax: "rename {path} {newName}",
  run: async function (client, message, args) {
    const drive = await GetDriveData(message.channel.id);

    if (!args[1]) throw new Err("Please provide a path!", "path-not-provided");
    if (!args[2]) throw new Err("Please provide a name!", "name-not-provided");
    else if (args[2].includes("/"))
      throw new Err("File names cannot contain a `/`!", "illegal-file-name");
    else if (args[2].match(/\s/))
      throw new Err("File names cannot contain a space!", "illegal-file-name");

    let resolvedPath = ResolvePath(drive, args[1], true);

    if (resolvedPath == "/")
      throw new Err("Cannot rename root!", "root-rename-attempt");

    let path = resolvedPath.split("/").filter((dir) => dir);

    const pathHead = path.pop();

    let obj = drive.fs["/"];
    for (let dir of path) {
      obj = obj[dir];
    }

    obj[args[2]] = obj[pathHead];
    delete obj[pathHead];

    await WriteDriveData(message.channel.id, drive);

    message.reply(`Successfully renamed \`${pathHead}\` to \`${args[1]}\``);
  },
};
