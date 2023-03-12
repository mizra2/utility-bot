const Discord = require("discord.js");
const CH = require("wokcommands");
const mongoose = require("mongoose");
const path = require("path");
require("dotenv/config");
const { Player } = require("discord-player");

const Client = new Discord.Client({
  intents: [
    Discord.GatewayIntentBits.GuildMessages,
    Discord.GatewayIntentBits.GuildMembers,
    Discord.GatewayIntentBits.DirectMessages,
    Discord.GatewayIntentBits.MessageContent,
    Discord.GatewayIntentBits.Guilds,
    Discord.GatewayIntentBits.AutoModerationExecution,
    Discord.GatewayIntentBits.AutoModerationConfiguration,
    Discord.GatewayIntentBits.GuildModeration,
    Discord.GatewayIntentBits.GuildVoiceStates,
  ],
  partials: [
    Discord.Partials.Message,
    Discord.Partials.Channel,
    Discord.Partials.GuildMember,
    Discord.Partials.User,
    Discord.Partials.GuildScheduledEvent,
    Discord.Partials.ThreadMember,
  ],
});

Client.on("ready", (client) => {
  console.log("The bot is ready");

  new CH({
    client,
    mongoUri: process.env.MONGO_URI,
    commandsDir: path.join(__dirname, "./src/commands"),
    testServers: ["1083979385993973823"],
    events: {
      dir: path.join(__dirname, "./src/events"),
    },
  });

  client.user.setActivity(`🎶`, { type: Discord.ActivityType.Playing });
});

Client.player = new Player(Client);

Client.player.events.on("playerStart", (queue, track) => {
  queue.metadata.channel.send(`🎶 Started playing **${track.title}**`);
});

Client.login(process.env.TOKEN);
