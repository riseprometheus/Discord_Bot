exports.run = (client, message,args) => {
  if(args.length <2 || args.length == 0 ){
    message.reply("It looks like there was a problem with your parameters. Please double check them.")
  }
  if(message.member.hasPermission('MANAGE_NICKNAMES'))
  {
    var id = args.shift();
    message.channel.fetchMessage(id).then((msg)=>{
      msg.edit(args.join(" ")).then(message.delete()).catch(console.error);
    });
    return;
  }
  message.channel.send("Sorry, you don't have the correct permissions to do that.").catch(console.error);
  return;

}
