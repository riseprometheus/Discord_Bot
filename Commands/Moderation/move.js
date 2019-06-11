exports.run = (client, message,args) => {
  var channelID = message.member.voiceChannelID;
  if(channelID === null){
    message.reply("Please be in a voice channel to move a user.");
    return;
  }

  var collectionKey = message.mentions.members.firstKey();
  message.mentions.members.get(collectionKey).setVoiceChannel(channelID);

  return;
}
