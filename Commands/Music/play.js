exports.run = (client, message,args) => {
try{
  if(message.member.voiceChannel==null)
  {
    message.reply('You must be in a voice channel to use this command.')
    return;
  }
  var voiceChannel = message.member.voiceChannel;
  const stream = require('youtube-audio-stream')
  const url = args[0]
  const decoder = require('lame').Decoder
  const speaker = require('speaker')

  voiceChannel.join().then(stream(url)
  .pipe(decoder())
  .pipe(speaker()))
}
catch(err)
{
  console.log(err)
}
 }
