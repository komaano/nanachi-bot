const axios = require('axios');
const cheerio = require('cheerio');
const Discord = require('discord.js');

// TODO: Embed this and add character images. Also possibly add a case for minor characters? 
function getWiki(message, argsArray) {

    axios.get("https://en.touhouwiki.net/wiki/" + argsArray.join('_')) //replace whitespaces with underscores
    .then((response) => {
        let touhouResponse = cheerio.load(response.data);
        touhouResponse('meta').each((i, meta) => {
            let nameAttr = meta.attribs.name;
            if(nameAttr === 'description') {
                messageText = meta.attribs.content;
                message.channel.send(messageText.replace(/&#[0-9]+;[0-9]*&#[0-9]+;/g, '').replace(/&#[0-9]+;/g, ' '));
            }
        });
    })
    .catch((err) => {
        message.channel.send("Something went wrong. You probably didn't search for an actual Touhou character. Check any misspellings, capitalizations, etc.");
    });
}

module.exports = {getWiki};