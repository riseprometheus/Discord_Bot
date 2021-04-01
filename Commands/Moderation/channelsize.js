exports.run = (client, message, args) => {
  const responseTemplate = require('../../bot.js')
  const responseEmbed = responseTemplate.getEmbedTemplate()

  var channelID = message.member.voice.ChannelID
  if (channelID === null) {
    message.reply('Please be in a voice channel to set its user limit.')
    return
  }

  message.member.voice.channel.setUserLimit(args[0]).then(
    message.channel.send(responseEmbed.setTitle('Success!').setDescription(`Channel: ${message.member.voice.channel.name} size has been set to ${args[0]}!`)))
}
