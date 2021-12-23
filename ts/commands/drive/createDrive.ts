import { writeFileSync } from "fs";

export const command: Command = {
  name: "create",
  description: "Creates a drive",
  run: async function (client, message, args) {
    if (args[1] && args[1].match(/\S+/)) {
      const channel = await message.guild?.channels.create(args[1], {
        type: "GUILD_TEXT",
        permissionOverwrites: [
          { id: message.author.id, allow: ["VIEW_CHANNEL", "SEND_MESSAGES"] },
          {
            id: message.guild.roles.everyone.id,
            deny: ["VIEW_CHANNEL", "SEND_MESSAGES"],
          },
        ],
      });

      await writeFileSync(
        `${global.appRoot}/data/${channel?.id}.json`,
        JSON.stringify({
          channel: channel?.id,
          owner: message.author.id,
          fs: {
            "/": {
              type: "folder",
            },
          },
        })
      );
      const msg = await message.reply(`Drive ${channel} created successfully!`);

      setTimeout(() => {
        msg.delete();
        message.delete();
      }, 5000);
    } else {
      const msg = await message.reply(`Please provide a drive name!`);

      setTimeout(() => {
        msg.delete();
        message.delete();
      }, 5000);
    }
  },
};
