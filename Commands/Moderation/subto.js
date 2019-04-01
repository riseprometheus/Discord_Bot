exports.run = (client, message,args) => {
  var game = args.join(" ");
  var roleID = "";
  var roleAddSuccess = false;
  var userHadRole = false;
  var roleExists = false;
  const fs = require('fs');
  //check for role already there
  var gamesProcessed = 0;

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
        var roleExists = false;
        results.forEach(function(sqlRecord){
          gamesProcessed++
          if(roleExists == true) return;
          //if(gameString == "") continue;
          if(sqlRecord.game.toLowerCase()==game.toLowerCase()){
            roleExists = true;
          }

        });
        if(gamesProcessed == results.length ){
            addGameRoleToUser(client,message,game,roleExists);
        }

      }
  });
  connection.close(function(err) {
    if(err) {
      console.log('error when disconnecting from db:', err);
      setTimeout(handleDisconnect, 2000);
    }
    logger.debug("MySql connection resumed.")
  });
  return;

}

function addGameRoleToUser(client,message,game, roleExists){
  if(roleExists){
  message.channel.guild.roles.forEach(function(role,roleID){
    if(role.name.toLowerCase() == game.toLowerCase()){
      if(message.member.roles.has(role.id)){
        message.channel.send({embed : {color: 0xFF0000,
            title: `Game Role Not Added`,
            fields: [{
              name: `Attention: ${message.member.nickname}`,
              value: `You already have the role: ${game}`
            }
          ],
          timestamp: new Date(),
          footer: {
            icon_url: client.user.avatarURL,
            text: "Brought to you by Prometheus"
          }

        }})
        userHadRole = true;
        return;
      }

      message.member.addRole(role.id).then(message.member.addRole(roleID)).then(
          message.channel.send({embed : {color: 0x4dd52b,
              title: `Game Role Added`,
              fields: [{
                name: `Role added to ${message.member.nickname}`,
                value: `Game: ${game}`
              }
            ],
            timestamp: new Date(),
            footer: {
              icon_url: client.user.avatarURL,
              text: "Brought to you by Prometheus"
            }

          }}))
        roleAddSuccess = true;

    }
  });
  }
  else{

      message.channel.send({embed : {color: 0xFF0000,
          title: `Game Role Not Added`,
          fields: [{
            name: `Attention: ${message.member.nickname}`,
            value: `This game role is not setup on this server: ${game}`
          }
        ],
        timestamp: new Date(),
        footer: {
          icon_url: client.user.avatarURL,
          text: "Brought to you by Prometheus"
        }

      }})
      return;

  }
}
