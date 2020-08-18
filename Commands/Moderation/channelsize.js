exports.run = (client, message,args) => {
  var channelID = message.member.voice.ChannelID;
  if(channelID === null){
    message.reply("Please be in a voice channel to set its user limit.");
    return;
  }

  console.log(`${channelID}`);
  message.guild.voice.channel.setUserLimit(args[0]);
  return;
}
