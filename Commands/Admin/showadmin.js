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
      setTimeout(handleDisconnect, 2000);
    }
    logger.debug("MySql connection resumed.")
  });
  var myQuery = `SELECT * FROM discord_sql_server.bot_admins`

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
  message.channel.send({embed : {color: 0x4dd52b,
      title: `Administration`,
      fields: [{
        name: "Number of Admins for Discord Bot",
        value: `Discord Bot has ${results.length} admin users.`
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

connection.end(function(err) {
  if(err) {
    console.log('error when disconnecting from db:', err);
    setTimeout(handleDisconnect, 2000);
  }
  logger.debug("MySql connection resumed.")
});
 }
