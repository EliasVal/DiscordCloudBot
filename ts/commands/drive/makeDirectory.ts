import {
  Err,
  GetDriveData,
  ResolvePath,
  ValidateFilename,
  WriteDriveData,
} from "../../utils";

export const command: Command = {
  description: "Creates a directory",
  name: "make-directory",
  aliases: ["mkdir"],
  syntax: "make-directory {name} [path]",
  run: async function (client, message, args) {
    const drive = await GetDriveData(message.channel.id);

    if (!args[1]) throw new Err("Please provide a name!", "missing-argument");

    let path: string | string[] = args[2]
      ? ResolvePath(drive, args[2])
      : drive.cwd;

    ValidateFilename(args[1]);

    path = path.split("/");
    path = path.filter((dir) => dir);

    let obj = drive.fs["/"];

    for (let dir of path) {
      obj = obj[dir];
    }

    obj[args[1]] = { type: "folder" };

    await WriteDriveData(message.channel.id, drive);
    message.reply(
      `Created Directory \`${args[1]}\`${
        args[2] ? " in `" + args[2] + "`" : ""
      }`
    );
  },
};
