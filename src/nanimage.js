const Discord = require('discord.js');
const Canvas = require('canvas');
const imageExtensions = ['jpg', 'jpeg', 'png'];

exports.makeHerPay = async function(callerIconURL, victimIconURL, channel) {
    let canvas = Canvas.createCanvas(1039, 715);
    let ctx = canvas.getContext("2d");

    let callerAvatar = await Canvas.loadImage(callerIconURL);
    let victimAvatar = await Canvas.loadImage(victimIconURL);
    let background = await Canvas.loadImage('./fuck_vriska.png');

    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(callerAvatar, 260, 75, 125, 125);
    ctx.drawImage(victimAvatar, 530, 250, 200, 200);

    let attachment = new Discord.Attachment(canvas.toBuffer(), 'making-them-pay.png');

    channel.send(undefined, attachment);
};

/**
 * 
 * @param {Discord.Message} message
 * @returns A wide19 version of the attached image, if successful. 
 */
exports.wide19 = async function(message) {
    let image, imageURL, imageName, height, width;
    let extracted = extractImage(message);
    if(!extracted) return;

    [imageURL, imageName] = extracted;

    try {
        image = await Canvas.loadImage(imageURL);
        height = image.height;
        width = image.width;
    }
    catch(error) {
        console.log(error);
        return;
    }

    let canvas = Canvas.createCanvas(19*height, height);
    let ctx = canvas.getContext("2d");

    ctx.drawImage(image, 0, 0, 19*height, height);

    let attachment = new Discord.MessageAttachment(canvas.toBuffer(), `${imageName}wide19.png`);
    message.channel.send('', attachment);
};

/**
 * This function extracts the image URL and image width from a message.
 * @param {Discord.Message} message The calling message.
 * @returns A 2 element array containing both the image URL and name.
 */
const extractImage = (message) => {
    let imageURL, imageName;
    let messageAttachments = Array.from(message.attachments.values());
    
    if(messageAttachments.length < 1) {
        imageURL = message.content.split(' ')[1];
        imageName = message.member.nickname.replace(' ', '-') + Date.now();
    }
    else {
        imageURL = messageAttachments[0].url;
        imageName = messageAttachments[0].name.split('.')[0];
    }


    let imageURLsplit = imageURL.split('.');
    let imageExtension = imageURLsplit[imageURLsplit.length-1];
    
    if(!(imageExtensions.includes(imageExtension))) return 0;
    
    return [imageURL, imageName]
}
