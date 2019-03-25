//let's do this
const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
    console.log("Connected as " + client.user.tag)
})

bot_secret_token = "Mzc2MjMzNjc4NTAzOTM2MDEw.D3nuqA.bfWPvFMKA-H6CPf52i7Hv0oUlm0"
client.login(bot_secret_token)