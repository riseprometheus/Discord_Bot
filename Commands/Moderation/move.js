exports.run = (client, message,args) => {

  if(typeof message.member.voice === 'undefined'){
    message.reply("please be in a voice channel to move a user.");
    return;
  }
  var channelID = message.member.voice.channelID;
  var collectionKey = message.mentions.members.firstKey();
  if(typeof collectionKey === 'undefined'){
    message.reply("please mention the member you would like to move.");
    return;
  }
  if(typeof message.mentions.members.get(collectionKey).voice.channelID === 'undefined'){
    message.reply("please make sure you and the target user are in a voice channel.");
    return;
  }
  message.mentions.members.get(collectionKey).voice.setChannel(channelID);

  return;
}
