exports.run = (client, message,args) => {
      var config = require('./paulConfig.json')

      console.log(message.guild.members.get(config.paulID).user.presence.status)
      var statusString =""

      switch(message.guild.members.get(config.paulID).user.presence.status) {
        case "online":
            var gameString = message.guild.members.get(config.paulID).user.presence.game.name
            statusString+=` and is playing ${gameString} poorly.`
            break;
        case "offline":
            statusString+=" doing god knows what."
            break;
        case "idle":
            statusString+=". Someone check to see if he is okay."
            break;
        case "dnd":
            statusString+=". Please be quiet for his sake."
            break;
        default:
            break;
      }

      message.channel.send(
        `Paul is currently ` + message.guild.members.get(config.paulID).user.presence.status + statusString)
 }
