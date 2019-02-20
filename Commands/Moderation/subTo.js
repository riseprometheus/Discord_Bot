exports.run = (client, message,args) => {
  var game = args.join(" ");
  var roleID = "";
  var roleAddSuccess = false;
  var userHadRole = false;
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

  if (roleAddSuccess == false && userHadRole == false){
    message.channel.send({embed : {color: 0xFF0000,
        title: `Game Role Not Added`,
        fields: [{
          name: `Attention: ${message.member.nickname}`,
          value: `This role is not setup on this server: ${game}`
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
  return;


}
