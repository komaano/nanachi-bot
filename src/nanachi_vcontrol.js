const reqClient = require('./client.js');
/**
 * Nanachi client object.
 * @type {Discord.Client}
 */

const client = reqClient.client;
const Discord = require('discord.js');
const fs = require('fs');
const Event = require('events');
const observeEmitter = new Event.EventEmitter();

const nanachiVoiceStates = {
    NOT_CONNECTED: "not_connected",
    NEUTRAL: "neutral",
    OBSERVING: "observing",
    PLAYING: "playing",
    SWITCHING: "switching" //acts as a buffer between states 
}

let lastKillCommandDate = 0;
let lastBombCommandDate = 0;
let nanachiVoiceState = nanachiVoiceStates.NOT_CONNECTED;
 

observeEmitter.on('undefinedUser', handleUndefinedUser);

function grind(message) {
    
    let deathchannels = null;
    let voicechannels = (Array.from(message.guild.channels.cache.values())).filter((channel) => {
        return (channel.type === "voice")
    });

    let diechannel = voicechannels[voicechannels.length-1];

    fs.readFile("DeathChannels.json", (err, jsonString) => {
        if(err) {
            console.log(`Failed to read file: ${err}`);
            deathchannels = {};
            return;
        }
        deathchannels = JSON.parse(jsonString);
        console.log(`Death channels: ${JSON.stringify(deathchannels)}`);

        if(deathchannels[message.guild.id] && message.guild.channels.cache.get(deathchannels[message.guild.id])) {
            diechannel = message.guild.channels.cache.get(deathchannels[message.guild.id]);
            console.log(`Found death channel: ${diechannel.name}`)
        }

        moveCloneDelete(diechannel, deathchannels);
    });
}

function kill(message, victims = undefined) {
    let d = new Date();
    let wasAnyoneKilled = false;
    if(!(message.member.hasPermission("ADMINISTRATOR") || message.member.id === "142907937084407808")) {
        message.channel.send("You must be an admin to kill people.");
        return;
    }
    else if(d - lastKillCommandDate < 1000*10) {
        message.channel.send(`Command on cooldown. ${parseFloat((1000*10 - (d - lastKillCommandDate))/1000).toFixed(2)} seconds remaining.`);
        return;
    }

    if(!victims) {
        victims = Array.from(message.mentions.members.values());
    }

    if(victims.length === 0) {
        message.channel.send("You didn't mention anyone.");
        return;
    }

    victims.forEach((victim) => {
        if(!victim.voice.channel) {
            message.channel.send(`${victim.displayName} is not in a voice channel.`);
        }

        else {
            victim.voice.kick()
            .then(() => console.log(`Kicked ${victim.displayName}`))
            .catch(console.error);

            wasAnyoneKilled = true;
        }
    });

    if(wasAnyoneKilled) {
        lastKillCommandDate = d;
    }
}

/**
 * 
 * @param {Discord.Message} message The message from a foreign server.
 * @param {Array} id An array of people to kill.
 * @param {Discord.Client} client This is just Nanachi's client instance. It's needed for things to work.
 */
function snipe(message, id, client) {
    

    if(!(message.member.hasPermission("ADMINISTRATOR") || message.member.id === "142907937084407808")) {
        message.channel.send("You must be an admin to kill people.");
        return;
    }
    
    console.log(`Attempting to kill ${id}...`);
    let guilds = Array.from(client.guilds.cache.values());

    for(let guild of guilds) {
        let voiceChannels = Array.from(guild.channels.cache.values()).filter(channel => channel.type === "voice");
        for(let voiceChannel of voiceChannels) {
            for(let voiceMember of Array.from(voiceChannel.members.values())) {
                let isGuildMember = guild.member(message.author);
                if(id.includes(voiceMember.id) && (message.author.id === 142907937084407808 || (isGuildMember && isGuildMember.hasPermission("ADMINISTRATOR")))) {
                    voiceMember.voice.kick()
                    .then(() => console.log(`Kicked ${voiceMember.displayName} in ${guild.name}`))
                    .catch(console.error);
                }
            }
        }
    }
    return;
}

function roulette(message) {

    voicechannels = (Array.from(message.guild.channels.cache.values())).filter((channel) => {
        return (channel.type === "voice")
    });

    voicemembers = voicechannels.reduce((total, voicechannel) => {
        total = total.concat(Array.from(voicechannel.members.values()))
        return total;
    }, []);

    victim = voicemembers[Math.floor(Math.random()*voicemembers.length)];

    kill(message, [victim]);
}

function scramble(message) {
    voicechannels = (Array.from(message.guild.channels.values())).filter((channel) => {
        return (channel.type === "voice")
    });
    
    voicemembers = voicechannels.reduce((total, voicechannel) => {
        total = total.concat(Array.from(voicechannel.members.values()));
        return total;
    }, []);

    voicemembers.forEach((member) => {
        member.setVoiceChannel(voicechannels[Math.floor(voicechannels.length*(Math.random()))])
        .then(moved => console.log(`Moved ${moved.displayName}`))
        .catch(console.error);
    })
}

//This does what it says. Doubles as a grind function with the default victim parameter
//deathchannels parameter cleans this up immensely
function moveCloneDelete(diechannel, deathchannels, victim = null) {

    diechannel.clone()
    .then((newclone) => {
        console.log(`Cloned ${diechannel.name}`)
        deathchannels[diechannel.guild.id] = newclone.id;
        
        fs.writeFile("DeathChannels.json", JSON.stringify(deathchannels), (err) => {
            if(err) {
                console.log(`Error writing file: ${err}`);
            }
            else console.log(`Wrote to file: ${JSON.stringify(deathchannels)}`);
        });
    })
    .then(() => {
        if(victim) {
            return victim.setVoiceChannel(diechannel).then(() => console.log(`${victim.displayName} moved to ${diechannel.name}`))
               .catch(console.error)    
        }

        else return 1;
    })
    .then(() => {
        diechannel.delete()
        .then((deleted) => console.log(`Deleted ${deleted.name}`))
    });
}

//argsArray is an array of arguments in the message. The first argument is expected to be the name of the death channel, or the ID of the death channel.
function setDeathChannel(message, argsArray) {
    let deathchannelString = argsArray[0];
    if(!(message.member.hasPermission("MANAGE_CHANNELS") || message.member.id === "142907937084407808")) {
        message.channel.send("You do not have permission to change the death channel.");
        return;
    }
    deathchannel = (Array.from(message.guild.channels.cache.values())).filter((channel) => {
        return (channel.type === "voice" && channel.id === deathchannelString)
    });

    if(deathchannel.length === 0) {
        message.channel.send("Could not find channel.");
        return;
    }
    else {
        fs.readFile("DeathChannels.json", (err, jsonString) => {

            if(err) {
                console.log(`Failed to read file: ${err}`);
                let deathchannels = {};
                return;
            }

            let deathchannels = JSON.parse(jsonString);
            console.log(`Death channels: ${JSON.stringify(deathchannels)}`);
            
            deathchannels[message.guild.id] = deathchannel[0].id;

            fs.writeFile("DeathChannels.json", JSON.stringify(deathchannels), (err) => {
                if(err) {
                    console.log(`Error writing file: ${err}`);
                }
                else console.log(`Wrote to file: ${JSON.stringify(deathchannels)}`);
            });
        });

        message.channel.send("Changed death channel.");
    }
}

/**
 * 
 * @param {Discord.Message} message Discord message
 * @param {Array} newRoleToObserve Role to observe, comes as an array of space separated strings
 * @param {Discord.Client} client Nanachi client instance
 * @return This function doesn't return anything,  
 */

function observe(message, newRoleToObserve, client, callerChannel=undefined, notify=true) {

    if(nanachiVoiceState === nanachiVoiceStates.PLAYING && nanachiVoiceState !== nanachiVoiceStates.SWITCHING) {
        message.channel.send("Cannot observe while playing audio.");
        return;
    }

    if(!callerChannel) {
        if(!message.member.voice.channel && nanachiVoiceState !== nanachiVoiceStates.OBSERVING) {
            message.channel.send("You aren't in a voice channel. Finding most populated channel...");
            callerChannel = getLargestChannel(message.guild);
            
            if(callerChannel.members.size === 0) {
                message.channel.send("Nobody is in vc.");
                return;
            }
    
        }
    
        else if(message.member.voice.channel) {
            callerChannel = message.member.voice.channel;
        }
    }
    
    roleToObserve = newRoleToObserve.join(" ");
    nanachiVoiceState = nanachiVoiceStates.OBSERVING;

    if(notify) {
        message.channel.send(`Observing ${roleToObserve}`);
    }

    callerChannel.join()
    .then((connection) => {
        connection.play("./join.mp3");
        return connection;
    })
    .then((connection) => {
        connection.on('speaking', (user, speaking) => {
            if(user && nanachiVoiceState === nanachiVoiceStates.OBSERVING) {
                console.log(`${user.username} is speaking`);
                let member = getGuildMemberFromUser(user, callerChannel.guild);
                if(user.id === member.id) {
                    if(Array.from(member.roles.cache.values()).some(role => role.name === roleToObserve) || roleToObserve === "*") {
                        member.voice.kick()
                        .then(() => console.log(`Kicked ${member.displayName}`))
                        .catch(console.error);
                    }
                }
                return;
            }

            else {
                
                if(nanachiVoiceState === nanachiVoiceStates.OBSERVING) {
                    connection.disconnect();
                    observeEmitter.emit('undefinedUser', message, newRoleToObserve, callerChannel);
                }

                return;
            }
        });
    })
    .catch(console.error);

    return;
}

function stopObserving(message) {
    nanachiVoiceState === nanachiVoiceStates.SWITCHING;
    message.channel.send("No longer observing.");
    setTimeout(() => {
        nanachiVoiceState = nanachiVoiceStates.NEUTRAL;
    }, 2000);
    return;
}

function leave(message) {
    let voiceConnections = Array.from(client.voice.connections.values());
    let guildVoiceConnection = voiceConnections.find(connection => {
        return (connection.channel.guild.id === message.guild.id); 
    });

    guildVoiceConnection ? guildVoiceConnection.disconnect() : message.channel.send("Not currently in vc.");
    nanachiVoiceState = nanachiVoiceStates.NEUTRAL;
    return;
}

/**
 * 
 * @param {Discord.Message} message 
 */
async function joinBomb(message) {
    let currentDate = new Date();
    
    message.delete()
    .catch(console.error);

    if(currentDate - lastBombCommandDate < 1000*30) {
        message.channel.send(`Command on cooldown. ${parseFloat((1000*10 - (currentDate - lastBombCommandDate))/1000).toFixed(2)} seconds remaining.`);
        return;
    }
    
    lastBombCommandDate = currentDate;
    nanachiVoiceState = nanachiVoiceStates.PLAYING;
    let callerChannel = message.member.voice.channel;
    let connection = null;
    let timer = true;

    if(!callerChannel && nanachiVoiceState !== nanachiVoiceStates.OBSERVING) {
        message.channel.send("You aren't in a voice channel. Finding most populated channel...");
        callerChannel = getLargestChannel(message.guild);
        
        if(callerChannel.members.size === 0) {
            message.channel.send("Nobody is in vc.");
            return;
        }
    }
    
    setTimeout(() => {
        timer = false;
        nanachiVoiceState = nanachiVoiceStates.NEUTRAL;
    }, 4000);

    setInterval(async () => {
        if(timer) {
            callerChannel.join()
            .then((connection) => connection.disconnect())
            .catch(console.error);
        }
    }, 100);

    return;
}
/**
 * 
 * @param {Discord.Message} message 
 * @param {string} roleToObserve 
 * @param {Discord.GuildChannel} callerChannel  
 */
function handleUndefinedUser(message, roleToObserve, callerChannel) {
    console.log(`event received; Voice State: ${nanachiVoiceState}`);
    if(nanachiVoiceState === nanachiVoiceStates.OBSERVING) {
        setTimeout(() => observe(message, roleToObserve, client, callerChannel, false), 700);
    }
}

/**
 * 
 * @param {Discord.User} user 
 * @param {Discord.Guild} guild 
 */
function getGuildMemberFromUser(user, guild) {
    return (Array.from(guild.members.cache.values()).find(member => member.id === user.id));
}

/**
 * 
 * @param {Discord.Guild} guild A discord server.
 * @returns {Discord.GuildChannel} guildChannel 
 */
function getLargestChannel(guild) {
    let voiceChannels = (Array.from(guild.channels.cache.values())).filter(channel => channel.type === 'voice');
    return (voiceChannels.reduce((accum, curr) => {
        accum = accum.members.size > curr.members.size ? accum : curr;
        return accum;
    }, voiceChannels[0]));
}

module.exports = {grind, roulette, scramble, setDeathChannel, kill, 
                  snipe, observe, stopObserving, leave, joinBomb};