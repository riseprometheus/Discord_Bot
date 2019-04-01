exports.run = (client, message,args) => {
  const fs = require('fs');

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
        setTimeout(handleDisconnect, 2000);
      }
      logger.debug("MySql connection resumed.")
    });

    var myQuery = `SELECT * FROM discord_sql_server.game_roles where server_id = ${message.guild.id}`
    connection.query(myQuery, function (error, results, fields) {
    if (error){
      console.log(error);
    }
    else{
      var gameRoles ="";
      if(results.length > 0){
        results.forEach((sqlRecord)=>{
          gameRoles += `${sqlRecord.game}\n` ;
        });
        message.channel.send({embed : {color: 0x4dd52b,
            title: `Current List Of Supported Game Roles`,
            fields: [{
              name: "Games:",
              value: gameRoles
            }
          ],
          timestamp: new Date(),
          footer: {
            icon_url: client.user.avatarURL,
            text: "Brought to you by Prometheus"
          }

        }}).then(message.delete());


      }else{
        message.channel.send({embed : {color: 0x4dd52b,
            title: `No Game Roles Found`,
            fields: [{
              name: "Games:",
              value: "You don't have any game roles set on this server."
            }
          ],
          timestamp: new Date(),
          footer: {
            icon_url: client.user.avatarURL,
            text: "Brought to you by Prometheus"
          }

        }})
      }
      connection.close(function(err) {
        if(err) {
          console.log('error when disconnecting from db:', err);
          setTimeout(handleDisconnect, 2000);
        }
        logger.debug("MySql connection resumed.")
      });
    }
  });
}
