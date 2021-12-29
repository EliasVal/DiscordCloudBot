import { GetDriveData, ResolvePath, WriteDriveData } from "../../utils";

export const command: Command = {
  description: "Creates a directory",
  name: "make-directory",
  aliases: ["mkdir"],
  syntax: "make-directory {name} [path]",
  run: async function (client, message, args) {
    const drive = await GetDriveData(message.channel.id);

    let path;

    if (args[2]) path = ResolvePath(drive, args[2]);
    else path = drive.cwd;

    if (args[1].includes("/")) {
      message.reply("A directory cannot have a `/` in it's name!");
      return;
    }

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
