exports.run = (client, message,args) => {
  if(args.length <2 || args.length == 0 ){
    message.reply("It looks like there was a problem with your parameters. Please double check them.")
  }
  var failToFindString = "Could not find message id in this channel. Please confirm you are sending command from correct channel.";
  var findFailure = false;
  if(message.member.hasPermission('MANAGE_NICKNAMES'))
  {
    var id = args.shift();

    message.channel.fetchMessage(id).catch(function(error){
      findFailure = true;
      message.channel.send(failToFindString);
    }).then((msg)=>{
        if(findFailure){
          return;
        }
        msg.edit(args.join(" ")).then(message.delete()).catch(console.error);
    });
    return;
  }
  message.channel.send("Sorry, you don't have the correct permissions to do that.").catch(console.error);
  return;

}
