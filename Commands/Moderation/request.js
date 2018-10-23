exports.run = (client, message,args) => {
  var config = require('./requestConfig.json')
  var messageAuthor = message.author.username
  console.log(messageAuthor)
  console.log(config.channelID)

  client.channels.get(
    config.channelID).send(`__**${messageAuthor}**__ has requested this: \n` + args.join(' '));

 }
