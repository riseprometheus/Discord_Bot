exports.run = (client, message,args) => {
    if(message.member.voiceChannelID == null || message.member == null )
    {
      message.reply('You must be in a voice channel to use this command.')
    }

    var voiceChannel = message.member.voiceChannel;
        voiceChannel.join().then(connection => {
            console.log("joined channel");
            const dispatcher = connection.playFile('Sounds/HankHill/HankLoveMeans.mp3');
            dispatcher.on("end", end => {
                console.log("left channel");
                voiceChannel.leave();
            });
        }).catch(err => console.log(err));
 }
