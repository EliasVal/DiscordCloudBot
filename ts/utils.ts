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
