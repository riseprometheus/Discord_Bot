exports.run = (client, message,args) => {
     if(!message.member.hasPermission('MANAGE_MESSAGES'))
     {
       message.channel.send("You don't have high enough permissions to do that.").catch(console.error);
       return;
     }
     var numberToDelete = 20;
     if(args.length != 0){
       if(args[0]<2)
       {
         message.channel.send("Must require 2 or more messages to be deleted.").catch(console.error);
         return;
       }
       numberToDelete = args[0];
     }
     message.channel.send("Attempting to delete last " + numberToDelete+" messages.").catch(console.error);

     message.channel.bulkDelete(numberToDelete+1).catch(function(error) {
       console.log(error.stack);
       message.channel.send("Something went wrong when deleting messages. Check permissions and try again.");
       return;
     });
     message.channel.send("The last " + numberToDelete+" messages have been deleted").catch(console.error);
 }
