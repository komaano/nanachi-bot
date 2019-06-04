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
    });
});

client.on('message', (receivedMessage) => {
    if(receivedMessage.author === client.user || receivedMessage.author.bot) { //prevent bot from responding to itself, or other bots
        return;
    }

    else if(receivedMessage.channel.id === "413868545705902082" && (receivedMessage.content !== "Lol." && receivedMessage.content !== "-l")) {
        receivedMessage.delete(15);
    }

    else if(receivedMessage.content.startsWith("-")) {
        processCommand(receivedMessage);
    }

});

client.on('messageUpdate', (oldMessage, newMessage) => {
    if(newMessage.channel.id === "413868545705902082") {
        newMessage.delete();
    }
});

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

        if(userchannel === undefined || (userchannel.name.toLowerCase() !== "die." && userchannel.name.toLowerCase() !== "the weather channel")) {
            receivedMessage.channel.send('Command failed. You are either in the wrong channel or my brain-damaged creator fucked something up.');
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

                    userchannel.delete('Die.')
                    .then(deleted => console.log("Grinded someone."))
                    .catch(console.error);
                    })
                    .catch(console.error);

            if(count == 1) {
                receivedMessage.channel.send(`Grinded ${count} idiot.`);
            }
            else {
                receivedMessage.channel.send(`Grinded ${count} idiots.`);
            }

        }
    }

    
    if(primaryCommand.toLowerCase() === "purge") {
        //check if user has permission to delete channels. if not, don't let them purge everyone
        if(!receivedMessage.member.hasPermission("MANAGE_CHANNELS") && receivedMessage.member.id !== "142907937084407808") {
            receivedMessage.channel.send("You are too weak to initiate a purge.");
        }

        else {

            let guildchannels = Array.from(receivedMessage.guild.channels.values()); //all channels in the current server
            let diechannel = null; //die channel will go here later
            let membercollection = []; //list of all members present in a voice channel

            for(let c of guildchannels) {

                if(c.type !== "voice") { //skip over text channels
                     continue;
                }
                else {
                    
                    if(c.name.toLowerCase() === "die." || c.name.toLowerCase() === "the weather channel") { //found the die channel
                        diechannel = c;
                        membercollection = membercollection.concat(Array.from(c.members.values())); 
                    }
                    
                    else if(c.members.size !== 0) {
                        membercollection = membercollection.concat(Array.from(c.members.values())); //put the members of each voice channel in the member array
                    }

                }
            }
            
            moveCloneDelete(null, membercollection, diechannel);

            if(membercollection.length !== 0) {
                receivedMessage.channel.send("The land has been purged of all idiots.");
            }
            else {
                receivedMessage.channel.send("There are currently no idiots to purge.");
            }
        }
    }

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
        if(receivedMessage.member.voiceChannel !== undefined && splitCommand[1] === "r" && receivedMessage.member.id === '142907937084407808') {
            receivedMessage.member.setVoiceChannel(`118106402932785156`)
            .then(() => console.log("PROBLEM OFFICER?"))
            .catch(console.error);
        }

        else if(receivedMessage.member.voiceChannel !== undefined && splitCommand[1] === "g" && receivedMessage.member.id === '142907937084407808') {
            receivedMessage.member.setVoiceChannel(`113011659886354432`)
            .then(() => console.log("PROBLEM OFFICER?"))
            .catch(console.error);
        }

        else {
            receivedMessage.channel.send("Only AA can invoke this.");
        }

        receivedMessage.delete()
        .then(() => console.log("Tracks hidden."))
        .catch(console.error);
    }

    //////////////////////////////////////////////////////////////////////

    if(primaryCommand.toLowerCase() === "stfu") {
        const now = new Date();
        let guildchannels = Array.from(receivedMessage.guild.channels.values());

        if(now - lastStfuCommanddate > 60*1000) {
            lastStfuCommanddate = now;
            for(let channel of guildchannels) {
                if(channel.type !== "voice") {
                    continue;
                }
                else {
                    let people = Array.from(channel.members.values());

                    if(people.length !== 0) { //this executes if the channel is not empty
                        muteControl(true, people);
                    }

                    else {
                        continue;
                    }
                }
            }

            setTimeout(() => {
                for(let channel of guildchannels) {
                    if(channel.type !== "voice") {
                        continue;
                    }
                    else {
                        let people = Array.from(channel.members.values());
    
                        if(people.length !== 0) { //this executes if the channel is not empty
                            muteControl(false, people);
                        }
    
                        else {
                            continue;
                        }
                    }
                }
            }, 10000);

        }

        else (
            receivedMessage.channel.send("Command on cooldown. " +"(" +(60 - (now - lastKillCommandDate)/1000) +" seconds remaining)")
        )
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    if(primaryCommand == "pl") {
        let hellchannel = receivedMessage.member.voiceChannel;
        if(hellchannel === undefined) {
            receivedMessage.channel.send("You are not in a voice channel.");
        }

        else {
            if(splitCommand[1] === "bomb") {
                hellchannel.join()
                .then((vconnection) => {
                    const player = vconnection.playFile("/home/pi/Desktop/nanachi/nanachi-bot/bomb.mp3");
                    player.on("end", end => {
                        hellchannel.leave();
                    })
                })
                .catch(console.error);
            }
            else if(splitCommand[1] === "mymom") {
                hellchannel.join()
                .then((vconnection) => {
                    const player = vconnection.playFile("/home/pi/Desktop/nanachi/nanachi-bot/my-mom.mp3");
                    player.on("end", end => {
                        hellchannel.leave();
                    })
                })
                .catch(console.error);
            }
            else if(splitCommand[1] === "ree") {
                if(receivedMessage.member.id !== ("142907937084407808" || "146849595010449409")) {
                    receivedMessage.channel.send("Only AA can invoke this.");
                }
                else {
                    hellchannel.join()
                    .then((vconnection) => {
                        const player = vconnection.playFile("/home/pi/Desktop/nanachi/nanachi-bot/FUCKING_NORMALFAGS.mp3");
                        player.on("end", end => {
                            hellchannel.leave();
                        })
                    })
                    .catch(console.error);
                }
            }
            else if(splitCommand[1] === "r4yd?") {
                hellchannel.join()
                .then((vconnection) => {
                    const player = vconnection.playFile("/home/pi/Desktop/nanachi/nanachi-bot/r4yd.mp3");
                    player.on("end", end => {
                        hellchannel.leave();
                    })
                })
                .catch(console.error);
            }
            else if(splitCommand[1] === "ed") {
                hellchannel.join()
                .then((vconnection) => {
                    const player = vconnection.playFile("/home/pi/Desktop/nanachi/nanachi-bot/ed.mp3");
                    player.on("end", end => {
                        hellchannel.leave();
                    })
                })
                .catch(console.error);
            }
            else if(splitCommand[1] === "takyon") {
                hellchannel.join()
                .then((vconnection) => {
                    const player = vconnection.playFile("/home/pi/Desktop/nanachi/nanachi-bot/Mario.mp3");
                    player.on("end", end => {
                        hellchannel.leave();
                    })
                })
                .catch(console.error);
            }
            else if(splitCommand[1] === "uh-oh") {
                hellchannel.join()
                .then((vconnection) => {
                    const player = vconnection.playFile("/home/pi/Desktop/nanachi/nanachi-bot/UH_OH_SISTERS.mp3");
                    player.on("end", end => {
                        hellchannel.leave();
                    })
                })
                .catch(console.error);
            }
            else {
                receivedMessage.channel.send("Not a valid command.");
            }
        }
    }

    if(primaryCommand.toLowerCase() === "ascend") {
        if(receivedMessage.member.id !== '142907937084407808') {
            receivedMessage.channel.send("Only AA is worthy of ascension.");
        }

        else {
            let myroles = Array.from(receivedMessage.member.roles.values());
            console.log(myroles);

            for(let role of myroles) {
                let rolename = role.name;
                if(rolename.toLowerCase() !== undefined && rolename.toLowerCase() === 'qp') {
                    role.setPermissions('ADMINISTRATOR')
                    .then(updated => console.log("Ascended."))
                    .catch(console.error);

                    receivedMessage.channel.send("AA has ascended.");
                    break;
                }
                else {
                    continue;
                }
            }
        }
    }
    return;

}

async function moveCloneDelete(receivedMessage, victims, diechannel) { //receivedMessage is what it says, victims is an array of guildmembers, diechannel is the death channel
    for(let victim of victims) {
        if(victim.voiceChannel === undefined && receivedMessage !== null) {
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