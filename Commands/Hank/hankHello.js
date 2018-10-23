exports.run = (client, message,args) => {
  if(message.member.voiceChannelID == null || message.member == null )
  {
    message.reply('You must be in a voice channel to use this command.')
  }
    var voiceChannel = message.member.voiceChannel;
        voiceChannel.join().then(connection => {
            const dispatcher = connection.playFile('Sounds/HankHill/HankHill.mp3');
            dispatcher.on("end", end => {
                voiceChannel.leave();
            });
        }).catch(err => console.log(err));
 }
