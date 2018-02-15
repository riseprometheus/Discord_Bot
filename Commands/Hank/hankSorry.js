exports.run = (client, message,args) => {
    var voiceChannel = message.member.voiceChannel;
        voiceChannel.join().then(connection => {
            console.log("joined channel");
            const dispatcher = connection.playFile('Sounds/HankHill/HankApologize.mp3');
            dispatcher.on("end", end => {
                console.log("left channel");
                voiceChannel.leave();
            });
        }).catch(err => console.log(err));
 }
