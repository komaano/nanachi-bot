//this module handles all the chat related commands of nanachi-bot

const Discord = require('discord.js');
const cheerio = require('cheerio');
const axios = require('axios');

const timeCubeLines = [];
const timeCubeImages = [];

exports.nnaa = (receivedMessage) => {
    
    let randomnum = Math.floor(Math.random()*101);
    let message = "Nnaa.";

    if(randomnum === 100) {
        message = "Bunny cunny.";
    }

    else if(randomnum >= 25 && randomnum < 50) {
        message = "Nnaa!";
    }

    else if(randomnum < 75) {
        message = "Nnaa~";
    }

    else if(randomnum < 100) {
        message = "Nnaa?";
    }

    receivedMessage.channel.send(message);

};
/**
 * 
 * @param {Discord.Message} message 
 */
exports.timecube = (message) => {
    let index;
    let splitmessage = message.content.split(' ');
    if(splitmessage.length > 1 && splitmessage[1] === "-image") {
        index = Math.floor(timeCubeImages.length*Math.random());
        message.channel.send(timeCubeImages[index]);
    }
    else {
        index = Math.floor(timeCubeLines.length*Math.random());
        message.channel.send(timeCubeLines[index]);
    }
    

};

const loadTimeCube = async () => {
    let baseURL = "https://timecube.2enp.com/";
    let response = await axios.get(baseURL);
    const $ = cheerio.load(response.data);
    
    $('span').each((index, element) => {
        if($(element).text().trim()) {
            timeCubeLines.push($(element).text());
        }
    });

    $('img').each((index, element) => {
        let src = $(element).attr("src");
        if(src) {
            if(src.startsWith("https")) {
                timeCubeImages.push($(element).attr("src"));    
            }
            else {
                timeCubeImages.push(baseURL + $(element).attr("src"));
            }
        }
    });
};

loadTimeCube();
