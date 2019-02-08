exports.run = (client, message,args) => {
//Input parameters are <Channel ID, Message to be sent>
  if(args.length <2 || args.length == 0 ){
    message.reply("It looks like there was a problem with your parameters. Please double check them.")
  }
   if(message.member.hasPermission('MANAGE_NICKNAMES'))
   {
     if(!(message.guild.me.hasPermission('MANAGE_MESSAGES'))){
       message.reply("Please enable the manage message permissions for the bot.")
       return;
     }
     const channel = client.channels.get(args[0]);
     var channelId = args.shift();
     if(args[0].toLowerCase() == "embed"){
       args.shift();
       var text = args.join(" ");
       channel.send({embed : {color: 0x4dd52b,
           description: text
           } }).then(()=>{
             if(message.channel.id == channelId){
               message.delete().catch(console.error);
               return
              }
         });
     }
     else{
       channel.send(args.join(" ")).then(()=>{
         if(message.channel.id == channelId){
           message.delete().catch(console.error);
          }
        });
      }
     return;
   }
   message.channel.send("Sorry, you don't have the correct permissions to do that.").catch(console.error);
   return;
}
