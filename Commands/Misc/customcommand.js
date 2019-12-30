exports.run = (client, message,args) => {
    var auth = require('./../../auth.json');
    var config = require('./../../config.json');
    if(message.member.hasPermission('MANAGE_ROLES'))
    {
      var mysql      = require('mysql');
      var mysqlConfig = require('../../sqlconfig.json')

      var connection = mysql.createConnection({
        host     : mysqlConfig.host,
        user     : mysqlConfig.user,
        password : mysqlConfig.password,
        database : mysqlConfig.database
      });

      connection.connect(function(err) {
        if(err) {
          console.log('error when connecting to db:', err);
        }
      });

      var myQuery = "SELECT * FROM discord_sql_server.server_custom_commands WHERE server_id = ?;";
      var serverID = message.guild.id;

      connection.query({sql:myQuery,
                          timeout: 40000},[serverID], function (error, results, fields) {
        if (error){
          console.log(error);
          return;
        }
        if(args.length == 0)
        {
          var customCommandListString = "";
          results.forEach((customCommand)=>{
            customCommandListString += ("**" + config.prefix + customCommand.command + "**" +"\n")

          });
          message.channel.send(
            {embed : {color: 0x4dd52b,
                description:"Current list of custom commands:\n " + customCommandListString}});
          connection.end();
          return;
        }

        if(args[0].toLowerCase() =="remove")
        {
          for(var index = 0; index < results.length; index++ )
          {
            if(results[index].command.toLowerCase() == args[1].toLowerCase())
            {
              var removalQuery = "DELETE FROM `discord_sql_server`.`server_custom_commands` WHERE `server_id`= ? and `command` = ?;"
              connection.query({sql:removalQuery,
                                  timeout: 40000},[serverID,args[1]], function (error, results, fields) {
                if (error){
                  console.log(error);

                  message.channel.send(
                    {embed : {color: 0xFF0000,
                        description: "Custom command: **" + args[1] + "** was not removed due to bot error. Please try again later."}});
                  connection.end();
                  return;
                }
                message.channel.send(
                  {embed : {color: 0x4dd52b,
                      description: "Custom command: **" + args[1] + "** was removed."}});
                connection.end();
                return;

            });
          }
        }
          connection.end();
          return;
        }

        var commandInput = args[0]
        var responseInput = args.slice(1).join(" ")

        var insertQuery = "INSERT INTO `discord_sql_server`.`server_custom_commands` (`server_id`, `command`, `embed_link`) VALUES (?, ?, ?);"
        connection.query({sql:insertQuery,
                            timeout: 40000},[serverID,commandInput,responseInput], function (error, results, fields) {
          if (error){
            console.log(error);

            message.channel.send(
              {embed : {color: 0xFF0000,
                  description: "Custom command: **" + args[0] + "** was not added due to bot error. Please try again later."}});
            connection.end();
            return;
          }
          message.channel.send(
            {embed : {color: 0x4dd52b,
                description:"New command: **" + config.prefix + commandInput + "** has been added to the list of custom commands."}});
          connection.end();
          return;

        });

      });
      return;
   }
   message.reply("You do not have the mod role required to use this function.");
   return;

 }
