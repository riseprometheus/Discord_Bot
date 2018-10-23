exports.run = (client, message,args) => {
  message.member.voiceChannel.join()
 .then(connection => console.log('Connected!'))
 .catch(console.error);
 }
