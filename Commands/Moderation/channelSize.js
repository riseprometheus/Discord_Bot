exports.run = (client, message,args) => {
  var channelID = message.member.voiceChannelID;
  console.log(`${channelID}`);
  message.guild.channels.get(channelID).setUserLimit(args[0]);
}
