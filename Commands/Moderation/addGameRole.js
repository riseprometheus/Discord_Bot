exports.run = (client, message,args) => {
  if(message.member.hasPermission('KICK_MEMBERS'))
  {
    const fs = require('fs');
    var game = args.join(" ");
    //check for role already there
    fs.readFile('./Commands/Moderation/gameRoles.txt', function read(err, data) {
    if (err) {

    }
    var gameRoles = data.toString().split("\n");
    var gamesProcessed = 0;
    var roleExists = false;
    gameRoles.forEach(function(gameString){
      gamesProcessed++
      if(roleExists == true) return;
      //if(gameString == "") continue;
      if(gameString.toLowerCase()==game.toLowerCase()){
        message.channel.send({embed : {color: 0x4dd52b,
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
      }
      if(gamesProcessed == gameRoles.length && roleExists == false){
          creatRole(client, message, game, fs);
      }
    });
  });
  }
  return;

}

function creatRole(client, message, game, fs){
  message.guild.createRole({
  name: game,
  color: 'BLUE',
  mentionable: true
  })
  .then(role => console.log(`Created new game role with name ${role.name} and color ${role.color}`))
  .catch(console.error);

  fs.appendFile('./Commands/Moderation/gameRoles.txt', `${game}\n`, function (err) {
    if (err) throw err;
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
  });
}
