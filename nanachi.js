//let's do this
const Discord = require('discord.js');
const client = new Discord.Client();

const Kaori = require('kaori');
const kaori = new Kaori();

let lastKillCommandDate = 0;

client.on('ready', () => {
    //list connected servers
    console.log("Servers:");
    client.guilds.forEach((guild) => {
        console.log(" - " + guild.name);
    })
})

client.on('message', (receivedMessage) => {
    if(receivedMessage.author === client.user || receivedMessage.author.bot) { //prevent bot from responding to itself, or other bots
        return;
    }

    if(receivedMessage.channel.id === "413868545705902082" && receivedMessage.content !== "Lol.") {
        receivedMessage.delete(5);
    }

    else if(receivedMessage.content.startsWith("-")) {
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

    if(primaryCommand.toLowerCase() === "grind") {
        userchannel = receivedMessage.member.voiceChannel;

        if(userchannel == null || (userchannel.name.toLowerCase() !== "die." && userchannel.name.toLowerCase() !== "the weather channel")) {
            receivedMessage.channel.send('You are not in the correct channel.');
        }

        else {

            let count = userchannel.members.size
            let clonedchannel = null;

            userchannel.clone()
                .then(result => { 
                    clonedchannel = result; 
                    if(userchannel.parent != null) {
                        clonedchannel.setParent(userchannel.parent);
                    }
                })
                .catch(console.error);

            userchannel.delete('Die.')
                .then(deleted => console.log("Grinded someone."))
                .catch(console.error);

            if(count == 1) {
                receivedMessage.channel.send(`Grinded ${count} idiot.`);
            }
            else {
                receivedMessage.channel.send(`Grinded ${count} idiots.`);
            }

        }
    }

    /*
    if(primaryCommand.toLowerCase() === "purge") {
        //check if user has permission to delete channels. if not, don't let them purge everyone
        if(!receivedMessage.member.hasPermission("MANAGE_CHANNELS")) {
            receivedMessage.channel.send("You are too weak to initiate a purge.");
        }

        else {
            userchannel = receivedMessage.member.voiceChannel;

            let guildchannels = receivedMessage.member.guild.channels.values(); //all channels in the current server
            let diechannel = null; //die channel will go here later
            let membercollection = []; //list of all members present in a voice channel
            let anyonepurged = false; //boolean to check if anyone was purged

            for(let c of guildchannels) {

                if(c.type !== "voice") { //skip over text channels
                     continue;
                }
                else {
                    
                    if(c.name === "Die." || c.name.toLowerCase() === "the weather channel") { //found the die channel
                        diechannel = c;
                        membercollection.push(c.members.values()); 
                    }
                    
                    if(c.members.size !== 0) {
                        membercollection.push(c.members.values()); //put the members of each voice channel in the member array
                    }

                }
            }

            console.log(membercollection);
            
            diechannel.clone() //clone and delete the die channel
                .then(result => { 
                    clonedchannel = result;
                    if(diechannel.parent !== null) { 
                        clonedchannel.setParent(diechannel.parent);
                    }
                    for(var i of membercollection) { //iterate over membercollection, which is actually a list of iterable objects
                        for(var victim of i) {
                            victim.setVoiceChannel(diechannel)
                                .then(() => console.log())
                                .catch(console.error);
                            anyonepurged = true;
                        }
                    }
                    
                    diechannel.delete('Die.')
                    .then(deleted => console.log("Purged."))
                    .catch(console.error);
                })
                .catch(console.error);


            if(anyonepurged) {
                receivedMessage.channel.send("The land has been purged of all idiots.");
            }
            else {
                receivedMessage.channel.send("There are currently no idiots to purge.");
            }
        }
    }
    */

    if(primaryCommand.toLowerCase() === "count") {
        if(receivedMessage.member.voiceChannel == null) {
            console.log(0)
        }
        else {
            console.log(receivedMessage.member.voiceChannel.members.size); //clean this up later
        }
    }

    if(primaryCommand.toLowerCase() === "kill") {
        let victims = receivedMessage.mentions.members;
        let count = 0;
        let guildchannels = receivedMessage.guild.channels.values();
        const now = new Date();
        
        if(now - lastKillCommandDate > 30*1000) {

            if(!receivedMessage.member.hasPermission("MANAGE_CHANNELS") && receivedMessage.member.id !== "142907937084407808") {
                receivedMessage.channel.send("You are not strong enough to commit murder.");
            }

            else {

                lastKillCommandDate = now;
                for(let c of guildchannels) {
                    if(c.type !== "voice") { //skip over text channels
                        continue;
                    }
                    else {
                    
                    if(c.name.toLowerCase() === "the weather channel" || c.name.toLowerCase() === "die.") { //found the die channel
                        diechannel = c;
                        }

                    }
                }

                for(let victim of victims.values()) {
                    if(victim.voiceChannel == null) {
                        continue;
                    }
                    else {
                        victim.setVoiceChannel(diechannel);
                    }
                }

                diechannel.clone() //clone and delete the die channel
                        .then(result => { 
                            clonedchannel = result; 
                            if(diechannel.parent != null) {
                                clonedchannel.setParent(diechannel.parent);
                            }
                            diechannel.delete('Die.')
                            .then(deleted => console.log("Purged."))
                            .catch(console.error);
                        })
                        .catch(console.error);
            }
        }

        else {
            receivedMessage.channel.send("Command on cooldown. " +"(" +(30 - 1000*(now - lastKillCommandDate)) +" seconds remaining)")
        }

    }
    return;

}

function getVCCount(voicechannel) {
    return voicechannel.members.size;
}

function getGuildChannels
bot_secret_token = "Mzc2MjMzNjc4NTAzOTM2MDEw.D3nuqA.bfWPvFMKA-H6CPf52i7Hv0oUlm0"
client.login(bot_secret_token)