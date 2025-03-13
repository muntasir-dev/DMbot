// Required permissions for bot: Add Bot → Enable Privileged Gateway Intents (for better performance).
// Copy the Token and keep it safe.
// Go to OAuth2 > URL Generator, select: bot, applications.commands
// Under Bot Permissions, enable Connect, Speak, Read Messages, and Send Messages.
// Copy the generated Invite Link and add the bot to your server.

const { Client, GatewayIntentBits } = require("discord.js");
const { Player } = require("discord-player");

// Create a Discord bot client
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// Initialize the music player
const player = new Player(client);
player.extractors.loadMulti();

client.once("ready", () => {
    console.log(`🎵 Music bot is online as ${client.user.tag}!`);
});

client.on("messageCreate", async (message) => {
    if (!message.guild || message.author.bot) return;

    // Bot prefix (can be changed according to users)
    const PREFIX = "!";

    if (!message.content.startsWith(PREFIX)) return;
    const args = message.content.slice(PREFIX.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    // Join a voice chalnnel and pley music
    if (command === "play") {
        if (!message.member.voice.channel) return message.reply("❌ Join a voice channel first!");
        const query = args.join(" ");
        if (!query) return message.reply("❌ Provide a song name or link!");

        try {
            await player.play(message.member.voice.channel, query, { textChannel: message.channel, member: message.member });
        } catch (error) {
            message.reply(`❌ Error: ${error.message}`);
        }
    }

    // Skip the currently playing  song
    if (command === "skip") {
        const queue = player.nodes.get(message.guild.id);
        if (!queue || !queue.node.isPlaying()) return message.reply("❌ No music is playing!");
        queue.node.skip();
        message.reply("⏭️ Skipped the current track!");
    }

    // Stop playing music
    if (command === "stop") {
        const queue = player.nodes.get(message.guild.id);
        if (!queue) return message.reply("❌ No music is playing!");
        queue.delete();
        message.reply("⏹️ Stopped playing music!");
    }

    // Show the current song
    if (command === "nowplaying") {
        const queue = player.nodes.get(message.guild.id);
        if (!queue || !queue.node.isPlaying()) return message.reply("❌ No music is playing!");
        const track = queue.currentTrack;
        message.reply(`🎵 Now Playing: **${track.title}** - ${track.author}`);
    }
});

// Login the bot
// client.login("MTM0OTI0NjcwMTM3Mzc1MTMzOA.GXZXEj.vX9WUWxG9iq-RJazCOXnG2qQm0gOU1InlIUpY4");
// old token : MTM0OTYyOTE4NDY0NDg3ODM2Nw.Gglq5b.fVcIprfOLJRVgXXRynz15BsskRTniMxwhQR7c8
