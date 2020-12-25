'use strict'

exports.getEmbedTemplate = (client) => {
  const Discord = require('discord.js')
  if (typeof client === 'undefined') {
    console.log('Was not passed client to embed template')
  }
  const embedTemplate = new Discord.MessageEmbed().setColor('#0099ff')

  embedTemplate.setColor('0x4dd52b')
    .setAuthor(client.user.username, client.user.avatarURL(), 'https://Conspirator.dev')
    .setTimestamp()
    .setFooter('Brought to you by Conspirator.dev', client.user.avatarURL())

  return embedTemplate
}

// exports.inviteLink = `https://discord.com/oauth2/authorize?client_id=${auth.clientID}&scope=bot`;
