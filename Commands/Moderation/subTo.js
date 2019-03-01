exports.run = (client, message,args) => {
  var game = args.join(" ");
  var roleID = "";
  var roleAddSuccess = false;
  var userHadRole = false;
  var roleExists = false;
  const fs = require('fs');
  //check for role already there
  var gamesProcessed = 0;
  fs.readFile('./Commands/Moderation/gameRoles.txt', function read(err, data) {
  if (err) {

  }

    var gameRoles = data.toString().split("\n");
    var roleExists = false;
    gameRoles.forEach(function(gameString){
      gamesProcessed++
      if(roleExists == true) return;
      //if(gameString == "") continue;
      if(gameString.toLowerCase()==game.toLowerCase()){
        roleExists = true;
      }

    });
    if(gamesProcessed == gameRoles.length ){
        addGameRoleTouser(client,message,game,roleExists);
    }

  });

  return;

}

function addGameRoleTouser(client,message,game, roleExists){
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
