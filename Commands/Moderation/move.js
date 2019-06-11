exports.run = (client, message,args) => {
  var channelID = message.member.voiceChannelID;
  if(channelID === null){
    message.reply("Please be in a voice channel to move a user.");
    return;
  }

  var collectionKey = message.mentions.users.firstKey();
  console.log(message.mentions.users.get(collectionKey)).setVoiceChannel(channelID);

  return;
}
