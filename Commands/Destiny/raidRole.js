exports.run = async (client, message,args) => {
    var request = require('request')
    var auth = require('./../../auth.json')
    var roleIDList = require('./destinyConfig.json')

    message.channel.startTyping();

    const HOST = 'https://www.bungie.net/Platform/Destiny2/';
<<<<<<< HEAD
=======
    var characterIDArray = [];
>>>>>>> 25c7efe14bc105899e307ccaf80e073191d3073b
    var count = 0;
    var gatheringData = true;
    var playerID = ""

    var baseRequest = request.defaults({headers: {'X-API-Key':auth.destinyAPI}});
    var player = args[0].split("#")[0];
    var number = args[0].split("#")[1];
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

<<<<<<< HEAD
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
=======
            baseRequest(HOST + '4/Profile/' + playerID + '/?components=100',
        			  function (err, response, body) {
                  try
                  {
                  characterIDArray = JSON.parse(body).Response.profile.data.characterIds;
                  }
                  catch(error)
                  {
                    //console.log(error)
                    message.channel.stopTyping();
                    message.reply("Sorry it looks like there was a problem retreiving that info from the Destiny Api.");
>>>>>>> 25c7efe14bc105899e307ccaf80e073191d3073b
                    return;
                  }
                  var raidActivitiesCleared = 0;
                  var congratsString = "Looks like you don't qualify for any raid roles."
                  var roleID = ""
<<<<<<< HEAD
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
=======
                  characterIDArray.forEach((characterID)=>
                  {
                    baseRequest(HOST + '4/Account/' + playerID + '/Character/' + characterID +'/stats',
                      function (err, response, body) {
                          count++;
                          if(JSON.parse(body).Response.raid=={})
>>>>>>> 25c7efe14bc105899e307ccaf80e073191d3073b
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
<<<<<<< HEAD
                          if(count == characterArray.length)
=======
                          if(count == characterIDArray.length)
>>>>>>> 25c7efe14bc105899e307ccaf80e073191d3073b
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
                              message.member.addRole(roleID)
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
