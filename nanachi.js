//let's do this
const Discord = require('discord.js');
const client = new Discord.Client();

const Kaori = require('kaori');
const kaori = new Kaori();

let lastKillCommandDate = 0;
let lastStfuCommanddate = 0;

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

            let guildchannels = receivedMessage.guild.channels.values(); //all channels in the current server
            let diechannel = null; //die channel will go here later
            let membercollection = []; //list of all members present in a voice channel
            let anyonepurged = false; //boolean to check if anyone was purged

            for(let c of guildchannels) {

                if(c.type !== "voice") { //skip over text channels
                     continue;
                }
                else {
                    
                    if(c.name.toLowerCase() === "die." || c.name.toLowerCase() === "the weather channel") { //found the die channel
                        diechannel = c;
                        membercollection.push(Array.from(c.members.values())); 
                    }
                    
                    else if(c.members.size !== 0) {
                        membercollection.push(Array.from(c.members.values())); //put the members of each voice channel in the member array
                    }

                }
            }
            
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
        if(receivedMessage.member.voiceChannel === null) {
            console.log(0)
        }
        else {
            console.log(receivedMessage.member.voiceChannel.members.size); //clean this up later
        }
    }

    if(primaryCommand.toLowerCase() === "kill") {
        let victims = Array.from(receivedMessage.mentions.members.values());
        let count = 0;
        let guildchannels = Array.from(receivedMessage.guild.channels.values());
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

                moveCloneDelete(receivedMessage, victims, diechannel);

            }
        }

        else {
            receivedMessage.channel.send("Command on cooldown. " +"(" +(30 - (now - lastKillCommandDate)/1000) +" seconds remaining)")
        }

    }

    if(primaryCommand.toLowerCase() === "ploblem?") {
        if(receivedMessage.guild.id === `110125954348613632` && receivedMessage.member.voiceChannel !== undefined) {
            receivedMessage.member.setVoiceChannel(`118106402932785156`)
            .then(() => console.log("PROBLEM OFFICER?"))
            .catch(console.error);
        }

        receivedMessage.delete()
        .then(() => console.log("Tracks hidden."))
        .catch(console.error);
    }

    //////////////////////////////////////////////////////////////////////

    if(primaryCommand.toLowerCase() === "stfu") {
        const now = new Date();
        let guildchannels = Array.from(receivedMessage.guild.channels.values());
        let allmuted = [];

        if(now - lastStfuCommanddate > 60*1000) {
            for(let channel of guildchannels) {
                if(channel.type !== "voice") {
                    continue;
                }
                else {
                    let people = Array.from(channel.members.values());
                    allmuted.concat(people);

                    if(people.length !== 0) { //this executes if the channel is not empty
                        muteControl(true, people);
                    }

                    else {
                        continue;
                    }
                }
            }

            setTimeout(muteControl(false, allmuted), 10000);

        }

        else (
            receivedMessage.channel.send("Command on cooldown. " +"(" +(60 - (now - lastKillCommandDate)/1000) +" seconds remaining)")
        )
    }
    return;

}

async function moveCloneDelete(receivedMessage, victims, diechannel) {
    for(let victim of victims) {
        if(victim.voiceChannel === undefined) {
            receivedMessage.channel.send(`${victim.displayName} is not in a voice channel.`)
            continue;
        }

        else {
            let holdmember = victim.setVoiceChannel(diechannel)
            .then(() => {
                console.log(`Moved ${victim.displayName}.`)
            })
            .catch(console.error);
            let holdresult = await holdmember; //wait here
        }

    }

    diechannel.clone()
    .then((clone) => { //we don't actually need to do anything with the cloned channel except set its parent
                    
        if(diechannel.parent !== undefined) {
            clone.setParent(diechannel.parent)
            .then(() => console.log("Set parent of clone."))
            .catch(console.error);
        }

        diechannel.delete()
        .then(() => console.log("Deleted the death channel."))
        .catch(console.error);

    })
    .catch(console.error);

}

async function muteControl(control, people) { //this function mutes a given set of people in voice
    people.forEach((person) => {
        person.setMute(control)
        .then(() => console.log(`${person.displayName} muted/unmuted.`))
        .catch(console.error);
    });
}
bot_secret_token = "Mzc2MjMzNjc4NTAzOTM2MDEw.D3nuqA.bfWPvFMKA-H6CPf52i7Hv0oUlm0"
client.login(bot_secret_token)