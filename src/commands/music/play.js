const { CommandType } = require("wokcommands");
const { ApplicationCommandOptionType } = require("discord.js");
const { QueryType } = require("discord-player");

module.exports = {
  name: "play",

  description: "Play a song for the homies!",

  slash: true,

  type: CommandType.SLASH,

  options: [
    {
      name: "query",
      description: "What do you want to listen to",
      required: true,
      type: 3,
    },
  ],

  callback: async ({ interaction }) => {
    try {
      const channel = interaction.member.voice.channel;
      if (!channel)
        return interaction.reply("You are not connected to a voice channel");

      const query = interaction.options.getString("query", true);

      await interaction.deferReply();

      const result = await interaction.client.player.search(query, {
        requestedBy: interaction.user,
        searchEngine: QueryType.AUTO,
      });

      const track = await interaction.client.player.play(channel, result, {
        // Node Options Provided by Discord-Player

        nodeOptions: {
          metadata: {
            channel: interaction.channel,
            client: interaction.guild.members.me,
            requestedBy: interaction.user,
          },
          selfDeaf: true,
          volume: 80,
          leaveOnEmpty: true,
          leaveOnEmptyCooldown: 300000,
          leaveOnEnd: true,
          leaveOnEndCooldown: 300000,
        },
      });

      // TODO: ADD EMBED IF I FEEL LIKE IT LATER
      // Or can keep it simple
    
      return interaction.followUp(
        `**${track.track.title}** has been added to the queue!`
      );
    } catch (e) {
      // let's return error if something failed
      console.log(e);
    }
  },
};
