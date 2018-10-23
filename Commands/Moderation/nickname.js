exports.run = (client, message,args) => {
   if(message.member.hasPermission('CHANGE_NICKNAME'))
   {
     console.log(args.join(' '));
     console.log(message.member.user.username);
     message.member.setNickname(args.join(' '));
     return;
   }
   message.channel.send("Sorry, you don't have the correct permissions to do that.").catch(console.error);
 }
