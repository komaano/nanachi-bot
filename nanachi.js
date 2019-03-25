//let's do this
const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
    //list connected servers
    console.log("Servers:");
    client.guilds.forEach((guild) => {
        console.log(" - " + guild.name);
    })
})

client.on('message', (receivedMessage) => {
    if(receivedMessage.author == client.user) { //prevent bot from responding to itself
        return;
    }

    if(receivedMessage.content.startsWith("-")) {
        processCommand(receivedMessage);
    }

})

function processCommand(receivedMessage) {
    let fullCommand = receivedMessage.content.substr(1);
    let splitCommand = fullCommand.split(" ");
    let primaryCommand = splitCommand[0];
    if(primaryCommand.toLowerCase() === "n") {
        var dice = Math.floor(Math.random()*101); //produce an integer from 0 to 100 inclusive, and send a different nnaa depending on it
        if(dice < 25) {
            receivedMessage.channel.send("Nnaa.");
        }
        else if(dice < 50) {
            receivedMessage.channel.send("Nnaa!");
        }
        else if(dice < 75) {
            receivedMessage.channel.send("Nnaa?");
        }
        else if(dice < 100) {
            receivedMessage.channel.send("Nnaa~");
        }
        else {
            receivedMessage.channel.send("Bunny cunny.");
        }
    }
    if(primaryCommand.toLowerCase() === "i'll") {
        receivedMessage.channel.send("Yield to none!");
    }
    if(primaryCommand.toLowerCase() === "l") {
        receivedMessage.channel.send("Lol.");
    }
    return;

}
bot_secret_token = "Mzc2MjMzNjc4NTAzOTM2MDEw.D3nuqA.bfWPvFMKA-H6CPf52i7Hv0oUlm0"
client.login(bot_secret_token)