exports.run = (client, message,args) => {
  var game = args.join(" ");
  var wasRemoved = false;
  message.member.roles.forEach(function(role,roleID){
    if(role.name.toLowerCase() == game.toLowerCase()){
      message.member.removeRole(role.id).then(
        message.channel.send({embed : {color: 0x4dd52b,
            title: `Game Role removed`,
            fields: [{
              name: `Role removed from ${message.member.nickname}`,
              value: `Game: ${game}`
            }
          ],
          timestamp: new Date(),
          footer: {
            icon_url: client.user.avatarURL,
            text: "Brought to you by Prometheus"
          }

        }})
      );
      wasRemoved = true;
      return
    }
  });
  if(wasRemoved==false){
  message.channel.send({embed : {color: 0xFF0000,
      title: `Role not found`,
      fields: [{
        name: `Role not removed from ${message.member.nickname}`,
        value: `Game: ${game}`
      }
    ],
    timestamp: new Date(),
    footer: {
      icon_url: client.user.avatarURL,
      text: "Brought to you by Prometheus"
    }

  }})
}
}
