exports.run = (client, message,args) => {
  const fs = require('fs');
  fs.readFile('./Commands/Moderation/gameRoles.txt', function read(err, data) {
    if (err) {
      return;
    }
    var gameRoles = data.toString();
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

  });
}
