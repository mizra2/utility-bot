const { CommandType } = require("wokcommands");
const { ApplicationCommandOptionType } = require("discord.js");
const { QueryType } = require("discord-player");
const { QueueRepeatMode } = require("discord-player");
const { ApplicationCommandOptionChoice } = require("discord.js");

module.exports = {
  name: "loop",

  description: "Track / Queue / Autoplay / Off",

  slash: true,

  type: CommandType.SLASH,

  options: [
    {
      name: "mode",
      description: "loop option",
      required: true,
      choices: [
        { name: "track", value: QueueRepeatMode.TRACK },
        { name: "queue", value: QueueRepeatMode.QUEUE },
        { name: "autoplay", value: QueueRepeatMode.AUTOPLAY },
        { name: "off", value: QueueRepeatMode.OFF },
      ],
      type: 10,
    },
  ],

  callback: async ({ interaction }) => {
    const userChannel = interaction.member.voice.channel;
    const queue = await interaction.client.player.nodes.get(
      interaction.guild.id
    );

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
    
    const mode = interaction.options.getNumber("mode");

    queue.setRepeatMode(mode);
    // TODO Embed ? 

    return interaction.reply(
      `Updated loop mode ${
        mode === QueueRepeatMode.TRACK || mode === QueueRepeatMode.QUEUE
          ? "🔂"
          : `▶`
      }`
    );
  },
};
