const { CommandType } = require("wokcommands");
const { ApplicationCommandOptionType } = require("discord.js");
const { QueryType } = require("discord-player");

module.exports = {
  name: "skip",

  description: "Skip the current song!",

  slash: true,

  type: CommandType.SLASH,

  callback: async ({ interaction }) => {
    const userChannel = interaction.member.voice.channel;
    const queue = interaction.client.player.nodes.get(interaction.guild.id);

    if (!userChannel)
      return interaction.reply("You are not connected to a voice channel");

    if (!queue)
      return interaction.reply(
        "Bot is not connected to any channel. Try playing something with /play!"
      );

    if (userChannel.id != queue.channel.id) {
      return interaction.reply("You are not connected to the same channel");
    }

    if (!queue.node.isPlaying()) {
      return interaction.reply(
        "No current song to skip! Try playing a song using /play!"
      );
    }

    // TODO: EMBED

    queue.node.skip();

    return interaction.reply("Skipped the current song!");
  },
};
