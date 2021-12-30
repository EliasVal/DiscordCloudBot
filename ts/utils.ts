import { Message, MessageEmbed } from "discord.js";
import { readFileSync, readFile, writeFile, writeFileSync } from "fs";

/**
 * Synchronously fetches the JSON file of the drive.
 * @param {string} channelId The ID of the drive's channel.
 * @returns {Object} JSON object with drive's data.
 */
export function GetDriveDataSync(channelId: string): Drive {
  return JSON.parse(
    readFileSync(`${global.appRoot}/data/${channelId}.json`).toString()
  );
}

/**
 * Asynchronously fetches the JSON file of the drive.
 * @param {string} channelId The ID of the drive's channel.
 * @returns {Object} JSON object with drive's data.
 */
export function GetDriveData(channelId: string): Promise<Drive> {
  return new Promise((resolve, reject) => {
    readFile(`${global.appRoot}/data/${channelId}.json`, (err, res) => {
      if (err) reject(err);
      else resolve(JSON.parse(res.toString()));
    });
  });
}

/**
 * Synchronously fetches the JSON file of the drive.
 * @param {string} channelId The ID of the drive's channel.
 * @param {drive} data The Drive object.
 */
export function WriteDriveDataSync(channelId: string, data: Drive): void {
  writeFileSync(
    `${global.appRoot}/data/${channelId}.json`,
    JSON.stringify(data)
  );
}

/**
 * Asynchronously fetches the JSON file of the drive.
 * @param {string} channelId The ID of the drive's channel.
 * @param {drive} data The Drive object.
 */
export function WriteDriveData(channelId: string, data: Drive): Promise<void> {
  return new Promise((resolve, reject) => {
    writeFile(
      `${global.appRoot}/data/${channelId}.json`,
      JSON.stringify(data),
      (err) => {
        if (err) reject(err);
        resolve();
      }
    );
  });
}

/**
 *
 * @param {Drive} drive The Drive object
 * @param {string} directory Desired Directory
 * @returns Resolved Directory
 */
export function ResolvePath(
  drive: Drive,
  directory: string,
  allowFile: boolean = false
): string {
  let desiredDir = directory.split(/\/+/);
  if (directory.startsWith("/")) desiredDir.unshift("/");

  if (directory.match(/\s/g))
    throw new Err("File names cannot contain a space!", "illegal-file-name");

  // Remove empty elements
  desiredDir = desiredDir.filter((dir) => dir);

  if (directory.startsWith("/")) {
    while (desiredDir.indexOf("..") != -1) {
      desiredDir.splice(desiredDir.indexOf("..") - 1, 2);
    }
    if (desiredDir.indexOf("/") == -1) {
      throw new Err("Cannot go back any further than root!", "back-from-root");
    }
  } else {
    desiredDir = ["/", ...drive.cwd.split("/"), ...desiredDir];

    // Remove empty elements
    desiredDir = desiredDir.filter((dir) => dir);

    while (desiredDir.indexOf("..") != -1) {
      desiredDir.splice(desiredDir.indexOf("..") - 1, 2);
    }
    if (desiredDir.indexOf("/") == -1) {
      throw new Err("Cannot go back any further than root!", "back-from-root");
    }
  }

  let obj = drive.fs;

  // Remove empty elements
  desiredDir = desiredDir.filter((dir) => dir);

  // "CD" into Current Working Directory
  for (let dir of desiredDir) {
    // @ts-ignore
    obj = obj[dir];

    if (
      obj == null ||
      (desiredDir.indexOf(dir) != desiredDir.length - 1 &&
        obj.type == "file" &&
        !allowFile)
    ) {
      throw new Err(
        "This directory does not exist!",
        "directory-does-not-exist"
      );
    }
  }

  return desiredDir.join("/").replace(/\/+/g, "/");
}

export class Err extends Error {
  code: string;
  constructor(message: string, code: string) {
    super(message);
    this.code = code;
    this.name = "DriveError";
  }
}

export function handleError(
  client: _Client,
  error: Error | Err,
  message: Message | null = null,
  args: string[] | null = null
): void {
  if (message) {
    message.reply({
      embeds: [
        new MessageEmbed({
          title: "Something went wrong!",
          description:
            "Something went wrong while trying to execute the command. Please try again later.\n\nThe developers have been notified, thank you for your patience",
          color: "DARK_RED",
        }),
      ],
    });
  }

  client.users.fetch(global.config.dev).then((dev) => {
    const embed = new MessageEmbed()
      .setColor("DARK_RED")
      .setTitle(error.name)
      .setDescription(`${"```"}${error.stack}${"```"}`)
      .addField("Short", `\`${error.message}\``);

    if (args) embed.addField("Command Executed", `\`${args.join(" ")}\``);

    dev.send({ embeds: [embed] });
  });
}
