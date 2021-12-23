import * as discord from "discord.js";
import { readFileSync, readdirSync } from "fs";
import { config as dotenv } from "dotenv";

dotenv();

// Set approot
global.appRoot = __dirname.split("/js")[0];

// Set config
global.config = JSON.parse(readFileSync(appRoot + "/config.json").toString());

// @ts-ignore
const client: _Client = new discord.Client({
  intents: [
    "GUILDS",
    "GUILD_MESSAGES",
    "DIRECT_MESSAGES",
    "GUILD_MEMBERS",
    "GUILD_MESSAGE_REACTIONS",
  ],
});

client.commands = new discord.Collection();

console.log(__dirname);
client.on("ready", () => {
  // Read commands and import
  const folders = readdirSync(`${global.appRoot}/js/commands`);

  for (let sub of folders) {
    if (sub.endsWith(".js")) {
      const item = require(`${global.appRoot}/js/commands/${sub}`).command;
      client.commands.set(item.name, item);
    } else {
      let files = readdirSync(`${global.appRoot}/js/commands/${sub}`);
      for (let file of files) {
        const item =
          require(`${global.appRoot}/js/commands/${sub}/${file}`).command;
        client.commands.set(item.name, item);
      }
    }
  }

  console.log("Bot ready!");
});

client.on("messageCreate", (message) => {
  // Split message into array
  const args: string[] = message.content
    .substring(global.config.prefix.length)
    .split(/\s+/);

  // Check if first arg is an existing command
  if (client.commands.has(args[0].toLowerCase())) {
    // @ts-ignore
    const command: Command = client.commands.get(args[0].toLowerCase());
    command.run(client, message, args);
  }
});

client.login(process.env.TOKEN);
