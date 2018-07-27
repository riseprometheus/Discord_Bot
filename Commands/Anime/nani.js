exports.run = (client, message,args) => {
  console.log('made it here')
  if(message.member.voiceChannelID == null || message.member == null )
  {
    message.reply('You must be in a voice channel to use this command.')
  }

  console.log("made it here")
    var voiceChannel = message.member.voiceChannel;
        voiceChannel.join().then(connection => {
            const dispatcher = connection.playFile('Sounds/Anime/nani.mp3');
            dispatcher.on("end", end => {
                voiceChannel.leave();
            });
        }).catch(err => console.log(err));
 }
