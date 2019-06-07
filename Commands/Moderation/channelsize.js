exports.run = (client, message,args) => {
  var channelID = message.member.voiceChannelID;
  if(channelID === null){
    message.reply("Please be in a voice channel to set its user limit.");
    return;
  }

  console.log(`${channelID}`);
  message.guild.channels.get(channelID).setUserLimit(args[0]);
  return;
}
