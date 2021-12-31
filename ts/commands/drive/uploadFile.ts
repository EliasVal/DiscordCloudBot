import {
  ValidateFilename,
  Err,
  GetDriveData,
  ResolvePath,
  WriteDriveData,
} from "../../utils";

export const command: Command = {
  description: "Uploads a file",
  name: "upload",
  aliases: ["up"],
  syntax: "upload {name} [path] {messageAttachment}",
  run: async function (client, message, args) {
    const drive = await GetDriveData(message.channel.id);

    if (!message.attachments.first())
      throw new Err("Please attach a file!", "missing-argument");
    else if (!args[1])
      throw new Err("Please provide a name!", "missing-argument");

    ValidateFilename(args[1]);

    let path: string | string[] = args[2]
      ? ResolvePath(drive, args[2])
      : drive.cwd;

    path = path.split("/");
    path = path.filter((dir) => dir);

    let pathObj = drive.fs["/"];

    for (let dir of path) {
      pathObj = pathObj[dir];
    }

    let msg = await message.channel.send({
      // @ts-ignore
      files: [message.attachments.first()?.attachment],
    });

    if (pathObj[1])
      throw new Err("This file already exists!", "file-already-exists");

    pathObj[args[1]] = {
      type: "file",
      messageId: msg.id,
    };

    await WriteDriveData(message.channel.id, drive);

    msg = await message.reply(
      `Successfully uploaded \`${args[1]}\` to \`${"/" + path.join("/")}\``
    );

    setTimeout(async () => {
      await msg.delete();
      await message.delete();
    }, 5000);
  },
};
