//let's do this
const Discord = require('discord.js');
const client = new Discord.Client();

const Kaori = require('kaori');
const kaori = new Kaori();

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

client.on('error', console.error);

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
        receivedMessage.delete(10);
        receivedMessage.channel.send("Lol.");
    }

    if(primaryCommand.toLowerCase() == "grind") {
        userchannel = receivedMessage.member.voiceChannel;

        if(userchannel == null || userchannel.name.toLowerCase() != "die.") {
            receivedMessage.channel.send('You are not in the "Die." channel.');
        }

        else {

            let count = userchannel.members.size
            let clonedchannel = null;

            userchannel.clone()
                .then(result => { 
                    clonedchannel = result; 
                    clonedchannel.setParent(userchannel.parent);
                })
                .catch(console.error);

            userchannel.delete('Die.')
                .then(deleted => console.log("Grinded someone."))
                .catch(console.error);

            if(count == 1) {
                receivedMessage.channel.send(`Grinded ${count} retard.`);
            }
            else {
                receivedMessage.channel.send(`Grinded ${count} retards.`);
            }

        }
    }

    if(primaryCommand.toLowerCase() == "purge") {
        //check if user has permission to delete channels. if not, don't let them purge everyone
        if(!receivedMessage.member.hasPermission("MANAGE_CHANNELS")) {
            receivedMessage.channel.send("You are too weak to initiate a purge.");
        }

        else {
            userchannel = receivedMessage.member.voiceChannel;

            let guildchannels = receivedMessage.member.guild.channels.values();
            let diechannel = null;
            let membercollection = [];
            let anyonepurged = false;

            for(let c of guildchannels) {

                if(c.type != "voice") {
                     continue;
                }
                else {
                    
                    if(c.name == "Die.") {
                        diechannel = c;
                        membercollection.push(c.members.values());
                    }
                    
                    membercollection.push(c.members.values());

                }
            }

            for(let i of membercollection) {
                let check = i.next();
                while(!check.done) {
                    check.value.setVoiceChannel(diechannel);
                    check = i.next();
                    anyonepurged = true;
                }
            }

            diechannel.clone()
                .then(result => { 
                    clonedchannel = result; 
                    clonedchannel.setParent(diechannel.parent);
                    diechannel.delete('Die.')
                    .then(deleted => console.log("Purged."))
                    .catch(console.error);
                })
                .catch(console.error);


            if(anyonepurged) {
                receivedMessage.channel.send("The land has been purged of all retards.");
            }
            else {
                receivedMessage.channel.send("There are currently no retards to purge.");
            }
        }
    }

    if(primaryCommand.toLowerCase() == "count") {
        if(receivedMessage.member.voiceChannel == null) {
            console.log(0)
        }
        else {
            console.log(receivedMessage.member.voiceChannel.members.size); //clean this up later
        }
    }
    return;

}

function getVCCount(voicechannel) {
    return voicechannel.members.size;
}
bot_secret_token = "Mzc2MjMzNjc4NTAzOTM2MDEw.D3nuqA.bfWPvFMKA-H6CPf52i7Hv0oUlm0"
client.login(bot_secret_token)