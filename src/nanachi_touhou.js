const axios = require('axios');
const cheerio = require('cheerio');
const Discord = require('discord.js');
const Booru = require('booru');
const client = require('./client');

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

/**
 * 
 * @param {Discord.Message} message 
 */
async function kenemoko(message) {
    
    const imageEmbed = new Discord.MessageEmbed();
    const booru = Booru.forSite('gb');

    let args = message.content.substr(1).split(" ").slice(1);
    let results = null;
    let tags = ['fujiwara_no_mokou', 'kamishirasawa_keine', 'rating:safe'];
    let page = Math.floor(80*Math.random());
    
    if(args.includes('-y')) {
        tags.unshift('yuri');
        page = Math.floor(14*Math.random());
    }

    if(args.includes('-nsfw')) {
        if(!message.channel.nsfw) {
            message.channel.send("Can't do that in a non-nsfw channel.");
            return;
        }
        tags.pop();
        tags.push('rating:explicit');
        console.log(tags);
        page = Math.floor(6*Math.random());
        results = await booru.search(tags, {limit: 20, page: page});
    }
    else {
        results = await booru.search(tags, {limit: 20, page: page});
    }

    console.log(results.length);
    let post = results[Math.floor(results.length*Math.random())];
    
    imageEmbed.setTitle('Page link');

    if(!post) {
        client.genericErrorMessage(message);
        return;
    }

    if(post.postView) {
        imageEmbed.setURL(post.postView);
    }
    else {
        imageEmbed.setDescription('Source unavailable :(');
    }
    imageEmbed.setImage(post.fileUrl);
    imageEmbed.setColor('#B77C3E');
    message.channel.send({embed: imageEmbed});
    return;
}
module.exports = {getWiki, kenemoko};