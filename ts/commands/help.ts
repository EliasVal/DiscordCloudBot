export const command: Command = {
  description: "Shows the list of available commands",
  name: "help",
  syntax: "help",
  run: function (client, message, args) {
    message.channel.send("help");
  },
};
