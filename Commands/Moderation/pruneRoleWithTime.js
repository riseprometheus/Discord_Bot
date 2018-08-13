exports.run = (client, message, args) =>
{
  var auth = require('../../auth.json')
  var config = require('../../config.json')
  var userKickedString = ""
  if(message.member.hasPermission('KICK_MEMBERS'))
  {

    const skynetModule = require('../../Skynet/skynet.js')
    const skynet = new skynetModule.skynetBase(auth,config);
    var clanMembers = client.guilds.get(auth.home).members

    clanMembers.forEach(function(guildMember,guildMemberID)
    {
        if(guildMember.roles.has(auth.defaultRole))
        {
          if((Date.now()-guildMember.joinedTimestamp) > 86400000) //1 day = 86400000
          {
            console.log(guildMember.user.username)
            try{
            guildMember.user.send(skynet.getNewRoleKickString()).
            then(userKickedString +=(" "+guildMember.user.username) ).
            then(guildMember.kick())
            }
            catch(error)
            {
              client.guilds.get(auth.home).channels.get(auth.homeTextChannel).send(`@${guildMember.nickname} Please set up your roles before you are kicked by an @T-1000`)
            }
          }
        }
    })
    console.log(userKickedString.length)
    if(userKickedString.length == 0)
    {
      userKickedString = "0 members"
    }
    console.log(userKickedString)
    // client.guilds.get(auth.home).channels.get(auth.modChannel).send(userKickedString+ " were removed for not setting up their roles.")
  }
  else
  {
    message.channel.send("Can you explain to <@&" + auth.modRole + "> why you tried to run this command?")
  }
}
