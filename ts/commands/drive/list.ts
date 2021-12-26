import { GetDriveData } from "../../utils";

export const command: Command = {
  description: "List all files in current working directory",
  name: "list",
  aliases: ["ls", "dir"],
  run: async function (client, message, args) {
    await message.channel.sendTyping();
    const file = await GetDriveData(message.channel.id);

    let obj: Folder = file.fs;
    let splitWorkingDir = file.cwd.split("/");

    // Remove empty elements
    splitWorkingDir = splitWorkingDir.filter((dir) => dir);

    // Add "/" to signify root if array is empty.
    if (splitWorkingDir.length == 0) splitWorkingDir[0] = "/";

    // "CD" into Current Working Directory
    for (let dir of splitWorkingDir) {
      // @ts-ignore
      obj = obj[dir];
    }

    // Delete "type" property from folder object
    delete obj["type"];
    let files = Object.keys(obj);

    // Set header to current working directory
    let msg = `\`\`\`${splitWorkingDir[0] != "/" ? "/" : ""}${
      splitWorkingDir[splitWorkingDir.length - 1]
    }`;

    // Iterate through files & folders
    for (let [index, file] of files.entries()) {
      // Add └ and ┝ accordingly, and also add "/" at the end of the filename if its a folder.
      if (index != files.length - 1) {
        msg += `\n┝ ${file}${obj[file].type == "folder" ? "/" : ""}`;
      } else {
        msg += `\n└ ${file}${obj[file].type == "folder" ? "/" : ""}\`\`\``;
      }
    }

    message.channel.send(msg);
  },
};
