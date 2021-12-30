import { GetDriveData, ResolvePath, WriteDriveData } from "../../utils";

export const command: Command = {
  description: "Moves a file or a folder to a new location",
  name: "move",
  aliases: ["mv"],
  syntax: "move {path} {destinationPath}",
  run: async function (client, message, args) {
    const drive = await GetDriveData(message.channel.id);

    if (!args[1]) throw new Err("Please provide a path!", "path-not-provided");
    if (!args[2])
      throw new Err(
        "Please provide a destination path!",
        "destination-not-provided"
      );

    let pathStr = ResolvePath(drive, args[1], true);
    let destinationStr = ResolvePath(drive, args[2]);

    let pathArr = pathStr.split("/");
    let destinationArr = destinationStr.split("/");

    pathArr = pathArr.filter((dir) => dir);
    destinationArr = destinationArr.filter((dir) => dir);

    const pathHead = pathArr.pop();
    const destinationHead = destinationArr.pop();

    let pathObj = drive.fs["/"];
    for (let dir of pathArr) {
      pathObj = pathObj[dir];
    }

    let destinationObj = drive.fs["/"];
    for (let dir of destinationArr) {
      destinationObj = destinationObj[dir];
    }

    if (destinationHead != null)
      destinationObj[destinationHead][pathHead] = pathObj[pathHead];
    else destinationObj[pathHead] = pathObj[pathHead];

    delete pathObj[pathHead];

    await WriteDriveData(message.channel.id, drive);

    message.reply(
      `Successfully moved \`${pathHead}\` to \`${destinationStr}\``
    );
  },
};
