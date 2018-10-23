exports.run = (client, message, args) => {
  var d = new Date(); // for now
  var timeString = d.getHours()%12 + ':' + (d.getMinutes()<10 ? '0' + d.getMinutes() : d.getMinutes());
   message.channel.send('The current time is ' + timeString).catch(console.error);
 }
