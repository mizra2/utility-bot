const { CommandType } = require("wokcommands");
const {
  ApplicationCommandOptionType,
  EmbedBuilder,
  userMention,
} = require("discord.js");
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

      const embed = new EmbedBuilder();

      // Set URL not working I guess?

      embed
        .setDescription(
          `${
            !track.track.playlist
              ? `**${track.track.title}** has been added to the queue!`
              : `Multiple tracks have been added to the queue`
          }`
        )
        .setThumbnail(
          `${
            !track.track.playlist
              ? `${track.track.thumbnail}`
              : `${track.track.playlist.thumbnail.url}`
          }`
        )
        .setColor(`#FF0000`)
        .setAuthor({
          name: interaction.member.displayName,
          iconURL: interaction.member.user.avatarURL(),
        })
        .setTimestamp()
        .setFields([
          {
            name: "Duration",
            value: `\`${track.track.duration}\``,
            inline: true,
          },
          {
            name: "Requested By",
            value: userMention(interaction.member.user.id),
            inline: true,
          },
          {
            name: "Position",
            value: `\`${
              interaction.client.player.nodes
                .get(interaction.guild.id)
                .node.getTrackPosition(track.track) < 0
                ? 0
                : interaction.client.player.nodes
                    .get(interaction.guild.id)
                    .node.getTrackPosition(track.track) + 1
            }\``,
          },
        ]);

      return interaction.editReply({ embeds: [embed] });
    } catch (e) {
      // let's return error if something failed
      console.log(e);
    }
  },
};
