const fs = require('fs');

try {
    let config = require('./skynetConfig.json');
}
catch(e) {
    console.log("No Config found for skynet module.")
    let newConfig  = {
      initialized: false,
      guildID:'',
      homeTextChannel:'',
      onJoinRoleID:'',
      moderatorRole:''
    };
    let data = JSON.stringify(newConfig, null, 2);

    fs.writeFile('./Skynet/skynetConfig.json', data, (err) => {
    if (err) throw err;
    console.log('Blank config file created');
});
}


class skynetBase {
  constructor(){
    let config = require('./skynetConfig.json');
    this.initialized = config.initialized;
    this.guildID = config.guidID;
    this.homeTextChannel = config.homeTextChannel;
    this.NewUserRole = config.onJoinRoleID;
  }

  setupConfig(message){
      message.channel.send("Welcome to the setup for the Skynet Discord moderation suite.");
  }

  addNewUserRole(discordClient,member){
    if(discordClient.guilds.get(this.guildID).
      members.get(discordClient.user.id).hasPermission('MANAGE_ROLES')){
      if(member.roles.size == 1){
          member.addRole(this.NewUserRole).
          then(console.log(`${member.user.username} joined the server.`));
      }
    }
    else{
      discordClient.guilds.get(this.guildID).channels.get(this.homeTextChannel).
      send(`<@${discordClient.guilds.get(this.guildID).ownerID}>, the bot is missing the MANAGE_ROLES permission to add roles to new members.`)
    }

  }

}

module.exports = {
  skynetBase:skynetBase
}
