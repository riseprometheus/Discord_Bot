exports.run = (client, message,args) => {
  var channelID = message.member.voiceChannelID;
  if(channelID === null){
    message.reply("Please be in a voice channel to move a user.");
    return;
  }

  var collectionKey = message.mentions.members.firstKey();
  if(message.mentions.members.get(collectionKey).voiceChannelID === null){
    message.reply("Please make sure target user and yourself are in a voice channel.");
    return;
  }
  message.mentions.members.get(collectionKey).setVoiceChannel(channelID);

  return;
}
