import * as discord from "discord.js";
import { config } from "dotenv";

config();

const client = new discord.Client({
  intents: [
    "GUILDS",
    "GUILD_MESSAGES",
    "DIRECT_MESSAGES",
    "GUILD_MEMBERS",
    "GUILD_MESSAGE_REACTIONS",
  ],
});

client.login(process.env.TOKEN);
