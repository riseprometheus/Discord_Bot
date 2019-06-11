exports.run = (client, message,args) => {
  var channelID = message.member.voiceChannelID;
  if(channelID === null){
    message.reply("Please be in a voice channel to move a user.");
    return;
  }

  console.log(`${channelID}`);
  var collectionKey = message.mentions.users.firstKey();
  message.mentions.users[collectionKey].setVoiceChannel(message.member.voiceChannelID);

  return;
}
