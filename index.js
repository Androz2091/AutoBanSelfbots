/**
 * A bot that automatically detects selfbots and ban them
 */

// Import the discord.js module
const Discord = require("discord.js");

// Create an instance of a Discord client
const client = new Discord.Client();

// Load the config file
const config = require("./config");

client.on("ready", () => {
  console.log("[!] Ready !");
  client.user.setActivity(config.game);
});

// Create an event listener for new guild members
client.on("guildMemberAdd", (member) => {
    let IsCreatedLast24h = member.user.createdTimestamp > (Date.now()-86400000);
    let HasDefaultAvatar = !member.user.avatar;
    if(IsCreatedLast24h && HasDefaultAvatar){
        member.send(config.sentences.banned
            .replace("{guild}", member.guild.name)
        );
        member.guild.channels.get(config.logs).send(config.sentences.log
            .replace("{user}", member.user.tag)
            .replace("{guild}", member.guild.name)
        );
        member.ban("Selfbot");
    }
});

client.on("message", async (message) => {
    let IsCreatedLast24h = message.author.createdTimestamp > (Date.now()-86400000);
    let HasDefaultAvatar = message.author.avatar;
    let containsPorn = message.content.includes("naked");
    let containsLink = message.content.includes("https://");
    if(IsCreatedLast24h && HasDefaultAvatar && containsLink && containsPorn){
        message.author.send(config.sentences.banned
            .replace("{guild}", message.guild.name)
        );
        message.guild.channels.get(config.logs).send(config.sentences.log
            .replace("{user}", message.author.tag)
            .replace("{guild}", message.guild.name)
        );
        message.member.ban("Selfbot");
    }
});

client.on("guildCreate", (guild) => {
    if(config.whitelist.enabled){
        if(!config.whitelist.guilds.includes(guild.id)){
            guild.fetchMembers().then((g) => {
                g.members.get(g.ownerID).send(config.sentences.whitelist);
                guild.leave();
            });
        }
    }
});

client.login(config.token);