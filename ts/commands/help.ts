export const command: Command = {
  description: "Shows the list of available commands",
  name: "help",
  run: function (client, message, args) {
    message.channel.send("Get some help");
  },
};
