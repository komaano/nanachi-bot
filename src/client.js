const Discord = require('discord.js');
const client = new Discord.Client();

/**
 * 
 * @param {Discord.Message} message 
 */
function genericErrorMessage(message) {
    message.channel.send('Something went wrong. Try calling the command again?');
}
module.exports = {client, genericErrorMessage};