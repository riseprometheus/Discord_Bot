exports.run = (client, message,args) => {
    var auth = require('./../../auth.json');
    var config = require('./../../config.json');
    if(message.member.hasPermission('MANAGE_ROLES'))
    {
      const fs = require('fs');

      fs.readFile('./Commands/Misc/customCommandsSave.json', (err, input) => {
          try
          {
            var jsonArray = JSON.parse(input);

          }
          catch(err)
          {
          console.log("need to create empty json file")
          }
          if(args.length == 0)
          {
            //list current custom Commands
            var customCommandListString = ""
            jsonArray.forEach((customCommand)=>{
              customCommandListString += ("**" + config.prefix + customCommand.command + "**" +"\n")

            })
            message.channel.send(
              {embed : {color: 0x4dd52b,
                  description:"Current list of custom commands:\n " + customCommandListString}})

            return;
          }
          if(args[0].toLowerCase() =="remove")
          {
            for(var index = 0; index < jsonArray.length; index++ )
            {
              if(jsonArray[index].command.toLowerCase() == args[1].toLowerCase())
              {
                jsonArray.splice(index,1);
                break;
              }
            }
            var data = JSON.stringify(jsonArray,null,2);
            fs.writeFileSync('./Commands/Misc/customCommandsSave.json',data)
            message.channel.send(
              {embed : {color: 0x4dd52b,
                  description: "Custom command: **" + args[1] + "** was removed."}})
             return;
          }

          var commandInput = args[0]
          var responseInput = args.slice(1).join(" ")
          console.log("Command: " + commandInput)
          console.log("Response: " + responseInput)

          let newCommand = {
            "command": commandInput,
            "response": responseInput
          }

          try
          {
            jsonArray.push(newCommand)
            var data = JSON.stringify(jsonArray,null,2);
            fs.writeFileSync('./Commands/Misc/customCommandsSave.json',data)
            message.channel.send(
              {embed : {color: 0x4dd52b,
                  description:"New command: **" + config.prefix + newCommand.command + "** has been added to the list of custom commands."}})

        }
        catch(err)
        {
          console.log(err)
        }
    });

      return;
   }
   message.reply("You do not have the mod role required to use this function.")

 }
