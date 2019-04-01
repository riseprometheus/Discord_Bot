exports.run = (client, message,args) => {

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

  var newAdminId = args[0];

  checkForAdminUser(client, message, connection, message.author.id, newAdminId );

  return;
}

function checkForAdminUser(client, message, connection, userID, newAdminId){

 var myQuery = `SELECT * FROM discord_sql_server.bot_admins WHERE user_id=${userID}`;

 connection.query(myQuery, function (error, results, fields) {
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
 }
 else{
    if(results.length > 0){
      checkIfAdminExists(client, message, connection, userID, newAdminId);
      connection.end(function(err) {
        if(err) {
          console.log('error when disconnecting from db:', err);
        }
      });
      return;
    }else{
      message.channel.send({embed : {color: 0xFF0000,
          title: `Administration`,
          fields: [{
            name: "Insufficient permissions",
            value: `You do not have the adequate permissions to add a new admin user.`
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
      return ;
    }


 }});
}

function addAdminToDatabase(client, message, connection, userID, newAdminId){
  var myQuery = "INSERT INTO `discord_sql_server`.`bot_admins` (`user_id`, `user_name`) VALUES (?, ?);";
  var username = message.guild.members.get(newAdminId).user.username;
  connection.query({sql:myQuery,
                      timeout: 40000},[newAdminId,username], function (error, results, fields) {
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
     }
     else{
       message.channel.send({embed : {color: 0x4dd52b,
           title: `Administration`,
           fields: [{
             name: "Operation Successful",
             value: `User <@${newAdminId}> has been added as a bot admin.`
           }
         ],
         timestamp: new Date(),
         footer: {
           icon_url: client.user.avatarURL,
           text: "Brought to you by Prometheus"
         }
     }});
   }
});
}

function checkIfAdminExists(client, message, connection, userID, newAdminId){
  var myQuery = `SELECT * FROM discord_sql_server.bot_admins WHERE user_id=${newAdminId}`;

  connection.query(myQuery, function (error, results, fields) {
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
  }
  else{
     if(results.length > 0){
       message.channel.send({embed : {color: 0xFF0000,
           title: `Administration`,
           fields: [{
             name: "Operation Failed.",
             value: `This user is already listed as an admin for the bot.`
           }
         ],
         timestamp: new Date(),
         footer: {
           icon_url: client.user.avatarURL,
           text: "Brought to you by Prometheus"
         }

       }});
       return ;
     }else{
       addAdminToDatabase(client, message, connection, userID, newAdminId);
       return;
     }

  }});

}
