exports.run = (client, message,args) => {
  const responseTemplate = require('../../bot.js');
  const link = responseTemplate.inviteLink;
  const messageBody = `Thanks for your interest in adding Bot Overseer to your server! Please click the link above to proceed.\n`;

  let responseEmbed = responseTemplate.getEmbedTemplate();

  responseEmbed.setDescription(messageBody)
               .setTitle("Click Here To Add Bot Overseer To Your Server!")
               .setURL(`${link}`);

  message.channel.send(responseEmbed);

  return;
}
