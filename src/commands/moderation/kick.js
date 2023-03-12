const { CommandType } = require("wokcommands");
const { ApplicationCommandOptionType } = require("discord.js");

module.exports = {
  name: "kick",

  description: "Kick a user",

  slash: true,

  type: CommandType.SLASH,

  options: [
    {
      name: "user",
      description: "The user you wish to kick",
      required: true,
      type: 6,
    },
    {
      name: "reason",
      description: "Reason for the kick",
      required: false,
      type: 3,
    },
  ],

  // Not needed anymore because we are using a Slash Command Now
  // CorrectSyntax: "Correct syntax: {PREFIX}kick @[USER]",

  // Test Function

  callback: async ({ interaction }) => {
    const user = interaction.options.getUser("user");
    const reason = interaction.options.getString("reason");
    interaction.guild.members.kick(user, reason);

    await interaction.reply(`User: ${user} has been kicked for "${reason}" 🔨`);
  },
};
