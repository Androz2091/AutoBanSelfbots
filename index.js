/**
 * A bot that automatically detects selfbots and ban them
 */

// Import the discord.js module
const Discord = require("discord.js");

// Import chalk (for console.log with colors)
const chalk = require("chalk");

// Create an instance of a Discord client
const client = new Discord.Client();

// Load the config file
const config = require("./config");

client.on("ready", async () => {
    // Update bot status
    await client.user.setActivity(config.game);
    console.log("[!] Ready !");
});

// Create an event listener for new guild members
client.on("guildMemberAdd", (member) => {
    // Gets the user level
    let userLevel = level(member.user, false, false);
    console.log(chalk.blue("["+userLevel+"] ")+chalk.green(member.user.tag));
    // If the level is lower than 2, the user is not a selfbot
    if(userLevel < 2) return;
    // Else, sends a message to warn him
    member.send(config.sentences.banned
        .replace("{guild}", member.guild.name)
    );
    // Sending a message in the logs to warn the moderators
    member.guild.channels.get(config.logs).send(config.sentences.logs
        .replace("{user}", member.user.tag)
        .replace("{guild}", member.guild.name)
    );
    // And ban it from the server
    member.ban("Selfbot");
    console.log(chalk.red("[BANNED] ")+chalk.keyword("orange")(member.user.tag));
});

// Create an event listener for new messages
client.on("message", async (message) => {
    // Gets the user and message level
    let userLevel = level(message.author, message.content, message.nonce);
    console.log(chalk.blue("["+userLevel+"] ")+chalk.green(message.author.tag));
    // If the level is lower than 4, the user is not a selfbot
    if(userLevel < 4) return;
    // Delete the message
    message.delete();
    // Else, sends a message to warn him
    message.author.send(config.sentences.banned
        .replace("{guild}", message.guild.name)
    );
    // Sending a message in the logs to warn the moderators
    message.guild.channels.get(config.logs).send(config.sentences.logs
        .replace("{user}", message.author.tag)
        .replace("{guild}", message.guild.name)
    );
    // And ban it from the server
    message.member.ban("Selfbot");
    console.log(chalk.red("[BANNED] ")+chalk.keyword("orange")(message.author.tag));
});

// Create an event listener for new guilds
client.on("guildCreate", (guild) => {
    // If the whitelist is enabled
    if(config.whitelist.enabled){
        // If the new guild is not whitelisted
        if(!config.whitelist.guilds.includes(guild.id)){
            // Fetch the members (to make sure the founder is fetch)
            guild.fetchMembers().then((g) => {
                // When it's done, send a warn message to the server founder
                g.members.get(g.ownerID).send(config.sentences.whitelist);
                // And leave the guild
                guild.leave();
            });
        }
    }
});

client.login(config.token);

/**
 * Check a user and a message to get a level of dangerousness
 * @param {object} user The user object to check
 * @param {string} content The message content to check (optional)
 * @param {string} nonce The message signature (optional)
 */
function level(user, content, nonce){
    let level = 0;
    // Check the username
    let username = /^[a-z]+[0-9]+$/;
    if(user.username.match(username)) level++;
    // Check the avatar
    let avatar = user.avatar;
    if(!avatar) level++;
    // Check the creation date
    let creationDate = user.createdTimestamp;
    if(creationDate > (Date.now()-259200000)) level++;
    // Check the message content
    if(content){
        if(content.includes("https://")) level++;
        if(content.includes("hotos")) level = level+2;
    }
    // Check if the user is on mobile (some users on mobile devices don't send a signature)
    let devices = user.presence.clientStatus, isMobile = false;
    if(devices) for(let device in user.presence.clientStatus) if(device === "mobile") isMobile = true;
    // Check the message signature
    if(typeof nonce === "object" && !isMobile) level++
    return level;
}