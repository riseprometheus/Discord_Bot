exports.run = (client, message,args) => {
  if(message.member.hasPermission('KICK_MEMBERS'))
  {
    const fs = require('fs');
    var game = args.join(" ");
    //check for role already there
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
      var myQuery = `SELECT * FROM discord_sql_server.game_roles where server_id = ${message.guild.id}`;

      connection.query(myQuery, function (error, results, fields) {
        if (error){
          console.log(error);
        }
        else{
          var gamesProcessed = 0;
          var roleExists = false;
          results.forEach(function(sqlRecord){
            gamesProcessed++
            if(roleExists == true) return;
            //if(gameString == "") continue;
            if(sqlRecord.game.toLowerCase()==game.toLowerCase()){
              message.channel.send({embed : {color: 0xFF0000,
                  title: `Cannot Add Game Role`,
                  fields: [{
                    name: "Game Role Already Exists.",
                    value: `Game: ${game}`
                  }
                ],
                timestamp: new Date(),
                footer: {
                  icon_url: client.user.avatarURL,
                  text: "Brought to you by Prometheus"
                }

              }});
              roleExists = true;
              connection.end(function(err) {
                if(err) {
                  console.log('error when disconnecting from db:', err);
                }
              });
            }

          });
          if(gamesProcessed == results.length && roleExists == false){
              creatRole(client, message, game, connection);
          }


        }
    });
  }
  return;

}

function creatRole(client, message, game, connection){
  message.guild.createRole({
  name: game,
  color: 'BLUE',
  mentionable: true
  })
  .then(role => console.log(`Created new game role with name ${role.name} and color ${role.color}`))
  .catch(console.error);

  var myQuery = "INSERT INTO `discord_sql_server`.`game_roles` (`server_id`, `game`) VALUES (?, ?);";
  var serverID = message.guild.id;
  connection.query({sql:myQuery,
                      timeout: 40000},[serverID,game], function (error, results, fields) {
    if (error){
     console.log(error);
     message.channel.send({embed : {color: 0xFF0000,
         title: `Administration`,
         fields: [{
           name: "Problem Gathering Data",
           value: `Please try again later or contect your bot's admin.`
         }
       ],
       timestamp: new Date(),
       footer: {
         icon_url: client.user.avatarURL,
         text: "Brought to you by Prometheus"
       }
   }});
   connection.end(function(err) {
     if(err) {
       console.log('error when disconnecting from db:', err);
     }

 });
  }
    else{
      game = game.toUpperCase();
      message.channel.send({embed : {color: 0x4dd52b,
          title: `New Game Role Added`,
          fields: [{
            name: "Game Role:",
            value: game
          }
        ],
        timestamp: new Date(),
        footer: {
          icon_url: client.user.avatarURL,
          text: "Brought to you by Prometheus"
        }
      }});
      connection.end(function(err) {
        if(err) {
          console.log('error when disconnecting from db:', err);
        }
    });
  }
  });

}
