// let's do this

// imports
const vcontrol = require('./nanachi_vcontrol.js');
const icontrol = require('./nanimage.js');
const textcontrol = require('./nanachi_textcontrol.js');
const touhou = require('./nanachi_touhou.js');
const audiocontrol = require('./nanachi_audio.js');

const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs')

// helper function for the command dictionary
// args is "whether or not the command expects arguments *other* than the message itself"
// options is a list of option strings with their own help strings
function commandObjectCreation(helpString, functionPath, args = false, options = {}) {
    let obj = {
        "helpMessage": helpString, //helpstring for the command
        "path": functionPath
    };
    
    if(args) {
        obj["args"] = true;
    }

    if(options.length !== 0) {
        obj["options"] = options;
    }
    return obj;
}

// I should have probably kept all the help strings in some local file. This is really messy.
let commands = {
    "n": commandObjectCreation('Makes Nanachi say some variation of "Nnaa" **(Identical to -nnaa)**.', textcontrol.nnaa),
    "nnaa": commandObjectCreation('Makes Nanachi say some variation of "Nnaa".', textcontrol.nnaa),
    "grind": commandObjectCreation('Deletes and recreates the assigned death channel, disconnecting anyone inside. If unassigned, uses the last channel in the server list.', vcontrol.grind),
    "setdeath": commandObjectCreation('Sets the death channel for this server. Can only be called by AA, or someone with the "manage channels" permission. Expects channel ID as an argument.', vcontrol.setDeathChannel, true),
    "help": commandObjectCreation('Sends a list of commands if no argument is provided, or a description string of the given command.', help, true),
    "kill": commandObjectCreation('**(Admin/AA only)** Kicks all people mentioned in the message from vc. Has a cooldown of 10 seconds, if anyone was actually kicked.', vcontrol.kill),
    "thwiki": commandObjectCreation('**(Under construction)** Displays information about the given Touhou character, courtesy of Touhou Wiki. A link to the character page will be provided, but please don\'t treat unsourced information as fact.', touhou.getWiki, true),
    "pl": commandObjectCreation('**(Under construction)** Plays a local audio file in whatever voice channel you\'re connected to. This command also has options. You can check them using "-help pl options".', 
                                audiocontrol.process, true, {"-a": "Adds the mp3 to Nanachi's pl dictionary. Expects an alias after the mp3 upload, uses filename otherwise.",
                                                          "-l": "Lists all the local audio files.",
                                                          "-r": " **(Admin only)** Removes a local audio file, given a name in the list."}),
    "roulette": commandObjectCreation('Randomly kills a person in vc.', vcontrol.roulette),
    "snipe": commandObjectCreation('**(Admin only)** Kills across servers. Expects a list of ids.', vcontrol.crossKill, true)
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
        else if(primaryCommand === "snipe") {
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


bot_secret_token = "";
client.login(bot_secret_token);