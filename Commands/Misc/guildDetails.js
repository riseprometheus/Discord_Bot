exports.run = (client, message, args) => {
  var numberOnline = 0;
  message.guild.presences.forEach(function(presence,snowID){
    if(presence.status == 'online'){
      numberOnline += 1;
    }
  });

  message.channel.send("Hello! Welcome to " + message.guild.name +
                        "! We have " + message.guild.memberCount+ " total members with "+
                         numberOnline + " currently online.").
  catch(console.error);
}
