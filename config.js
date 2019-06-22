module.exports = {

    // Your Discord bot token
    token: "",

    // The bot game : Playing to...
    game: "detect selfbots",

    /**
     * The messages that the bot will send 
     * {user} will be automatically replaced by User#0000
     * {guild} will be automatically replaced by the server name
     */
    sentences: {
        logs: "{user} was banned from {guild} because it's a selfbot!",
        banned: "You were banned from {guild} because we have detected that you are a selfbot!",
        whitelist: "Sorry, this server is not included in the whitelist!"
    },

    // The whitelist allows you to limit the bot to certain servers 
    whitelist: {
        enabled: false, // Whether the whitelist is enabled
        guilds: [] // Servers that are whitelisted
    },

    // The ID of the channel where the log messages will be sent (for admins)
    logs: ""
    
}
