exports.run = async (client, message,args) => {
    var request = require('request');
    var auth = require('./../../auth.json');
    var roleIDList = require('./destinyConfig.json');

    message.channel.startTyping();

    const HOST = 'https://www.bungie.net/Platform/Destiny2/';
    var count = 0;
    var gatheringData = true;
    var playerID = "";
    var nicknameIsUser = false;

    if (args === undefined || args.length == 0) {
      console.log(message.member.nickname);

      if( message.member.nickname == null){
        message.reply("Please provide a Battle.Net ID for me to search for.")
        message.channel.stopTyping();
        return;
      }

      if(!message.member.nickname.includes("#") || message.member.nickname == null){
        message.reply("Please provide a Battle.Net ID for me to search for.")
        message.channel.stopTyping();
        return;
      }
      nicknameIsUser = true;
    }

    var baseRequest = request.defaults({headers: {'X-API-Key':auth.destinyAPI}});

    var player = "";
    var number = "";
    if(nicknameIsUser){
      var name = message.member.nickname;
      player = name.split("#")[0];
      number = name.split("#")[1];
    }else{
      player = args[0].split("#")[0];
      number = args[0].split("#")[1];
    }

    try
    {
      baseRequest(HOST + 'SearchDestinyPlayer/4/' + player +'%23'+ number+'/',
  			  function (err, response, body) {
            try{

              playerID = JSON.parse(body).Response[0].membershipId;
            }
            catch(error)
            {
              if(JSON.parse(body).ErrorCode == 1)
              {
                message.channel.stopTyping();
                message.reply(`I couldn't find a user on Battle.net with the username ${player + "#" + number}.`)
                return;
              }
              else
              {
                message.channel.stopTyping();
                message.reply("Sorry it looks like there was a problem retreiving that info from the Destiny Api.")
                return;
              }
            }

            baseRequest(HOST + '4/Account/' + playerID + '/stats',
        			  function (err, response, body) {
                  try
                  {
                    if(JSON.parse(body).ErrorCode !=1)
                    {
                        message.channel.stopTyping();
                        message.reply("Looks like something is going on on Bungie's api so my information might not be complete. Please try again later for a more complete answer.")
                        return
                    }

                    //console.log(`Character ID: ${JSON.parse(body).Response.profile.data.characterIds}`)
                    characterArray = JSON.parse(body).Response.characters;

                  }
                  catch(error)
                  {
                    return;
                  }
                  var raidActivitiesCleared = 0;
                  var congratsString = "Looks like you don't qualify for any raid roles."
                  var roleID = ""
                  characterArray.forEach((character)=>
                  {
                    baseRequest(HOST + '4/Account/' + playerID + '/Character/' + character.characterId +'/stats',
                      function (err, response, body) {
                          count++;

                          if(JSON.parse(body).ErrorCode !=1)
                          {
                              message.channel.stopTyping();
                              message.reply("Looks like something is going on on Bungie's api so my information might not be complete. Please try again later for a more complete answer.")
                              return
                          }
                          if((Object.keys(JSON.parse(body).Response.raid).length === 0 && JSON.parse(body).Response.raid.constructor === Object))
                          {
                            return;
                          }
                          try
                          {
                            raidActivitiesCleared += Number(JSON.parse(body).Response.raid.allTime.activitiesCleared.basic.value)
                          }
                          catch(err)
                          {
                            return;
                          }
                          if(count == characterArray.length)
                          {
                            gatheringData = false;
                          }

                          if(!gatheringData)
                          {

                            if(raidActivitiesCleared>2)
                            {
                              congratsString = "Congratulations, you qualify for the @Novice Raider role!"
                              roleID = roleIDList.raidRole1
                            }
                            if(raidActivitiesCleared>6)
                            {
                              congratsString = "Congratulations, you qualify for the @Apprentice Raider role!"
                              roleID = roleIDList.raidRole2
                            }
                            if(raidActivitiesCleared>10)
                            {
                              congratsString = "Congratulations, you qualify for the @Journeyman Raider role!"
                              roleID = roleIDList.raidRole3
                            }
                            if(raidActivitiesCleared>15)
                            {
                              congratsString = "Congratulations, you qualify for the @Trained Raider role!"
                              roleID = roleIDList.raidRole4
                            }
                            if(raidActivitiesCleared>25)
                            {
                              congratsString = "Congratulations, you qualify for the @Skilled Raider role!"
                              roleID = roleIDList.raidRole5
                            }
                            if(raidActivitiesCleared>40)
                            {
                              congratsString = "Congratulations, you qualify for the @Expert Raider role!"
                              roleID = roleIDList.raidRole6
                            }
                            if(raidActivitiesCleared>75)
                            {
                              congratsString = "Congratulations, you qualify for the @Raid Master role!"
                              roleID = roleIDList.raidRole7
                            }

                            message.channel.stopTyping();
                            message.channel.send({embed : {color: 0x4dd52b,
                                description: "**" + congratsString + "**" + `\n\n You have completed ${raidActivitiesCleared} raid activities!`,
                                timestamp: new Date(),
                                footer: {
                                  icon_url: client.user.avatarURL,
                                  text: "Brought to you by Prometheus"
                                } }})

                            if(roleID != "")
                            {
                                message.member.addRole(roleID).catch(err=>console.log("Roles aren't setup on this server."));

                            }

                            return;
                		      }
                     });
        		      });
            });
      });
    }
    catch(err)
    {
      console.log("Leaving hoursPlayed command after failure.")
    }
}
