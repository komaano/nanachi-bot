// let's do this

// imports
const Discord = require('discord.js');
const reqClient = require('./client.js');
const client = reqClient.client;
const fs = require('fs');
const vcontrol = require('./nanachi_vcontrol.js');
const icontrol = require('./nanimage.js');
const textcontrol = require('./nanachi_textcontrol.js');
const touhou = require('./nanachi_touhou.js');
const audiocontrol = require('./nanachi_audio.js');
const auth = require('./auth.json');
const commandHelp = require('./Commands.json');

// helper function for the command dictionary
// args is "whether or not the command expects arguments *other* than the message itself"
// options is a list of option strings with their own help strings
function commandObjectCreation(helpString, functionPath, args = false) {
    let obj = {
        "helpMessage": helpString, //helpstring for the command
        "path": functionPath
    };
    
    if(args) {
        obj["args"] = true;
    }

    return obj;
}

// I should have probably kept all the help strings in some local file. This is really messy.
let commands = {
    "n": commandObjectCreation(commandHelp["n"], textcontrol.nnaa),
    "nnaa": commandObjectCreation(commandHelp["nnaa"], textcontrol.nnaa),
    "grind": commandObjectCreation(commandHelp["grind"], vcontrol.grind),
    "setdeath": commandObjectCreation(commandHelp["setdeath"], vcontrol.setDeathChannel, true),
    "help": commandObjectCreation(commandHelp["help"], help, true),
    "kill": commandObjectCreation(commandHelp["kill"], vcontrol.kill),
    "thwiki": commandObjectCreation(commandHelp["thwiki"], touhou.getWiki, true),
    "pl": commandObjectCreation(commandHelp["pl"], audiocontrol.process, true),
    "roulette": commandObjectCreation(commandHelp["roulette"], vcontrol.roulette),
    "snipe": commandObjectCreation(commandHelp["snipe"], vcontrol.snipe, true),
    "observe": commandObjectCreation(commandHelp["observe"], vcontrol.observe, true),
    "stopobserve": commandObjectCreation(commandHelp["stopobserve"], vcontrol.stopObserving),
    "leave": commandObjectCreation(commandHelp["leave"], vcontrol.leave)
}

client.on('ready', () => {
    //list connected servers
    console.log("Servers:");
    Array.from(client.guilds.cache.values()).forEach((guild) => {
        console.log(` - ${guild.name}`);
    });
});

client.on('message', (receivedMessage) => {
    if(receivedMessage.author === client.user || receivedMessage.author.bot) { //prevent bot from responding to itself, or other bots
        return;
    }

    //lol channel patrolling
    else if(receivedMessage.channel.id === "413868545705902082" && (receivedMessage.content !== "Lol." && receivedMessage.content !== "-l")) {
        receivedMessage.delete()
        .then(msg => console.log(`${receivedMessage.member.displayName} tried posting in #lol`))
        .catch(console.error);
        return;
    }

    else if(receivedMessage.member.id === "125355456653688832" && receivedMessage.content.toLowerCase().includes("wig")) {
        receivedMessage.channel.send({
            files: [{ attachment: './krabscock.png',
                      name: 'krabscock.png'}]})
        .then(console.log(`Mr. Krabs Fat Cock`))
        .catch(console.error);
    }

    else if(receivedMessage.content.includes("https://tenor.com/view/furry-pride-funny-gif-14755165")) {
        receivedMessage.delete()
        .then(msg => msg.channel.send("Fuck you."))
        .catch(console.error);
    }

    else if(receivedMessage.content.startsWith("-")) {
        processCommand(receivedMessage);
        return;
    }

});

client.on('messageUpdate', (oldMessage, newMessage) => {
    if(newMessage.channel.id === "413868545705902082") {
        newMessage.delete();
    }
});

client.on('error', console.error);

async function processCommand(receivedMessage) {

    let fullCommand = receivedMessage.content.substr(1);
    let splitCommand = fullCommand.split(" ");
    let primaryCommand = splitCommand[0].toLowerCase();
    let args = splitCommand.slice(1);
    let commandObject = commands[primaryCommand];

    if(!commandObject) {
        return;
    }
    else if(!commandObject.hasOwnProperty("args")) { //runs if command does not take any arguments
        commandObject["path"](receivedMessage);
    }
    else {
        if(args.length === 0) {
            if(primaryCommand === "help") {
                commandObject["path"](receivedMessage, []);
            }
            else {
                receivedMessage.channel.send("This commands expects arguments."); 
            }
        }
        else if(primaryCommand === "snipe" || primaryCommand === "observe") {
            commandObject["path"](receivedMessage, args, client);
        }
        else {
            commandObject["path"](receivedMessage, args);
        }
    }
}

//commandArray[0] is the only one that matters
function help(message, commandArray) {
    let newMessage = `List of commands:\n`;
    if(commandArray.length === 0) {
        Object.getOwnPropertyNames(commands).forEach((command) => {
            newMessage = newMessage + `-${command}\n`;
        });

        message.channel.send(newMessage);
    }
    else if(!commands.hasOwnProperty(commandArray[0])) {
        message.channel.send('Command not found. Try "-help" to see a list of available commands.');
        return;
    }
    else {
        message.channel.send(`${commands[commandArray[0]]["helpMessage"]}`);
    }
    
}

client.login(auth['token']);