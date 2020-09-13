const Discord = require('discord.js');
const Canvas = require('canvas')

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
}