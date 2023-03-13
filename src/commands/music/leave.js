const { CommandType } = require("wokcommands");
const { ApplicationCommandOptionType } = require("discord.js");
const { QueryType } = require("discord-player");
const { Player } = require("discord-player");

module.exports = {
  name: "leave",

  description:
    "Done Listening? Make the bot leave the server to reduce clutter!",

  slash: true,

  type: CommandType.SLASH,

  callback: async ({ interaction }) => {
    const userChannel = interaction.member.voice.channel;
    const queue = interaction.client.player.voiceUtils;
    const connection = queue.getConnection(interaction.guild.id);
    let botChannel;

    // If bot is connected to a channel

    try {
      botChannel = interaction.client.player.nodes.get(
        interaction.guild.id
      ).channel;
    } catch {
      return interaction.reply("Bot is not connected to any channel");
    }

    if (!userChannel)
      return interaction.reply("You are not connected to a voice channel");

    // Check if user is within the same channel

    if (userChannel.id != botChannel.id) {
      return interaction.reply("You are not connected to the same channel");
    }

    // Disconnect

    await queue.disconnect(connection);
    // TODO: Embed
    return interaction.reply(
      `Music Bot has been disconnected from ${interaction.member.voice.channel}`
    );
  },
};

// const { CommandType } = require("wokcommands");
// const { ApplicationCommandOptionType } = require("discord.js");
// const { QueryType } = require("discord-player");

// module.exports = {
//   name: "leave",

//   description: "Done Listening? Make the bot leave",

//   slash: true,

//   type: CommandType.SLASH,

//   callback: async ({ interaction }) => {
//     const userChannel = await interaction.member.voice.channel;

//     /* This is coded in a way so that it only works for
//     the bot I created and can not be applied to any bot
//      Not sure how to resolve at the moment as discord-player library has no
//      method provided to disconect the bot */

//     // Could check channel for any bots and disconnect the bot but that would
//     // cause all bots to disconnect

//     // TODO
//     const botChannel = await interaction.channel.members.get(
//       "1083979672779497533"
//     ).voice.channel;

//     if (!userChannel)
//       return interaction.reply("You are not connected to a voice channel");

//     if (!botChannel)
//       return interaction.reply("Bot is not connected to any channel");

//     if (userChannel.id != botChannel.id) {
//       return interaction.reply("You are not connected to the same channel");
//     }

//     await interaction.channel.members
//       .get("1083979672779497533")
//       .voice.disconnect();

//     return interaction.reply(
//       `Bot has been disconnected from ${interaction.member.voice.channel}`
//     );
//   },
// };
