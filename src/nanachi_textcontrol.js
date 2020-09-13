//this module handles all the chat related commands of nanachi-bot

const Discord = require('discord.js')

function nnaa(receivedMessage) {
    
    let randomnum = Math.floor(Math.random()*101);
    let message = "Nnaa.";

    if(randomnum === 100) {
        message = "Bunny cunny.";
    }

    else if(randomnum >= 25 && randomnum < 50) {
        message = "Nnaa!";
    }

    else if(randomnum < 75) {
        message = "Nnaa~";
    }

    else if(randomnum < 100) {
        message = "Nnaa?";
    }

    receivedMessage.channel.send(message);

}

module.exports = {nnaa};