import { MessageEmbed } from "discord.js";
import { Err } from "../utils";

export const command: Command = {
  description: "Shows the list of available commands",
  name: "help",
  syntax: "help [command]",
  run: async function (client, message, args) {
    if (!args[1]) {
      const embed = new MessageEmbed()
        .setTitle("Commands:")
        .setColor("DARK_ORANGE")
        .setDescription(
          "Use `help [command]` to show help about a specific command, including aliases.\n\n"
        )
        .setFooter(
          "Arguments shown in [] are optional, and arguments shown in {} are required."
        );
      for (const [name, command] of client.commands) {
        embed.description += `**${name}**:\n${command.description}\nUsage: \`${command.syntax}\`\n\n`;
      }

      message.reply({ embeds: [embed] });
    } else {
      if (!client.commands.has(args[1]))
        throw new Err("This command does not exist!", "invalid-command");

      // @ts-ignore
      const command: Command = client.commands.get(args[1]);

      const embed = new MessageEmbed()
        .setTitle(args[1])
        .setColor("DARK_ORANGE")
        .setDescription(
          `${command.description}\nUsage: \`${command.syntax}\`\n\nAliases:\n`
        )
        .setFooter(
          "Arguments shown in [] are optional, and arguments shown in {} are required."
        );

      if (command.aliases) {
        for (let alias of command.aliases) {
          embed.description += `\`${alias}\`${
            command.aliases.indexOf(alias) != command.aliases.length - 1
              ? ", "
              : ""
          }`;
        }
      } else embed.description += "N/A";

      message.reply({ embeds: [embed] });
    }
  },
};
