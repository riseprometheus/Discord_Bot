exports.run = (client, message,args) => {
  var channelID = message.member.voiceChannelID;
  if(channelID === null){
    message.reply("Please be in a voice channel to move a user.");
    return;
  }

  console.log(`${channelID}`);
  message.mentions.users.first().setVoiceChannel(message.member.voiceChannelID);

  return;
}
