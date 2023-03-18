const { CommandType } = require("wokcommands");
const { ApplicationCommandOptionType } = require("discord.js");
const { QueryType } = require("discord-player");

module.exports = {
  name: "currentsong",

  description: "Check the details and progress of the current song",

  slash: true,

  type: CommandType.SLASH,

  callback: async ({ interaction }) => {
    const userChannel = interaction.member.voice.channel;
    const queue = interaction.client.player.nodes.get(interaction.guild.id);

    if (!userChannel)
      return interaction.reply("You are not connected to a voice channel");

    if (userChannel.id != queue.channel.id) {
      return interaction.reply("You are not connected to the same channel");
    }

    if (!queue || !queue.node.isPlaying()) {
      return interaction.reply(
        "No track is currently playing. Try playing something with /play!"
      );
    }

    // TODO: EMBED
    return interaction.reply(
      `The current track is: ${
        queue.currentTrack.title
      }\n${queue.node.createProgressBar({ queue: true })}`
    );
  },
};
