exports.run = (client, message,args) => {
    var auth = require('./../../auth.json');
    if(message.member.roles.has(auth.modRole))
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
