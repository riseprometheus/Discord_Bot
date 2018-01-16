exports.run = (client, message,args) => {
   if(message.member.hasPermission('CHANGE_NICKNAME'))
   {
     console.log(args[0]);
     console.log(message.member.user.username);
     message.member.setNickname(args[0]);
     return;
   }
   message.channel.send("Sorry, you don't have the correct permissions to do that.").catch(console.error);
 }
