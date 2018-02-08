exports.run = (client, message,args) => {
     if(!message.member.hasPermission('MANAGE_MESSAGES'))
     {
       message.channel.send("You don't have high enough permissions to do that.").catch(console.error);
       return;
     }
     message.channel.send("Attempting to delete last 20 messages.").catch(console.error);
     message.channel.bulkDelete(20).catch(error => console.log(error.stack));
 }
