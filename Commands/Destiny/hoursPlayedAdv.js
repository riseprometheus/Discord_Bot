exports.run = async (client, message,args) => {
    var request = require('request')
    var auth = require('./../../auth.json')
    message.channel.startTyping();

    const HOST = 'https://www.bungie.net/Platform/Destiny2/';
    var characterArray = [];
    var count = 0;
    var gatheringData = true;
    var playerID = "";
    var nicknameIsUser = false;

    if (args === undefined || args.length == 0) {
      if(!message.member.nickname.includes("#")){
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

    console.log(player+"#"+number)
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
                message.reply(`I couldn't find a user on Battle.net with the username ${player + "#" + number}.`)
              }
              else
              {
                message.reply("Sorry it looks like there was a problem retreiving that info from the Destiny Api.")
              }
              message.channel.stopTyping();
              return;
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
                    characterArray = JSON.parse(body).Response.characters
                  }
                  catch(error)
                  {
                    return;
                  }
                  var minutesPlayed = 0;
                  var hoursPlayed = 0;

                  var totalPvpMinutes = 0;
                  var totalPatrolMinutes = 0;
                  var totalRaidMinutes = 0;
                  var totalStoryMinutes = 0;
                  var totalStrikesMinutes = 0;
                  //console.log('start: ' +minutesPlayed)
                  characterArray.forEach((character)=>
                  {
                    baseRequest(HOST + '4/Account/' + playerID + '/Character/' + character.characterId +'/stats',
                			  function (err, response, body) {
                          //console.log(`Minutes for ${count} ` + JSON.parse(body).Response.character.data.minutesPlayedTotal)
                          //.log(Number(JSON.parse(body).Response.character.data.minutesPlayedTotal))
                          if(JSON.parse(body).ErrorCode !=1)
                          {
                              message.channel.stopTyping();
                              console.log(HOST + '4/Account/' + playerID + '/Character/' + character.characterId +'/stats');
                              message.reply("Looks like something is going on on Bungie's api so my information might not be complete. Please try again later for a more complete answer.")
                              return
                          }
                          if(!(Object.keys(JSON.parse(body).Response.allPvP).length === 0 && JSON.parse(body).Response.allPvP.constructor === Object))
                          {
                            var pvpMinutes = Number(JSON.parse(body).Response.allPvP.allTime.secondsPlayed.basic.value)/60;
                            //console.log("pvpMinutes:" + pvpMinutes +"\n")
                            totalPvpMinutes += pvpMinutes;
                          }

                          if(!(Object.keys(JSON.parse(body).Response.patrol).length === 0 && JSON.parse(body).Response.patrol.constructor === Object))
                          {
                            var patrolMinutes = Number(JSON.parse(body).Response.patrol.allTime.secondsPlayed.basic.value)/60;
                            //console.log("patrolMinutes:" + patrolMinutes+"\n")
                            totalPatrolMinutes += patrolMinutes;
                          }

                          if(!(Object.keys(JSON.parse(body).Response.raid).length === 0 && JSON.parse(body).Response.raid.constructor === Object))
                          {
                            var raidMinutes = Number(JSON.parse(body).Response.raid.allTime.secondsPlayed.basic.value)/60;
                            //console.log("raidMinutes:" + raidMinutes+"\n")
                            totalRaidMinutes += raidMinutes
                          }

                          if(!(Object.keys(JSON.parse(body).Response.story).length === 0 && JSON.parse(body).Response.story.constructor === Object))
                          {
                            var storyMinutes = Number(JSON.parse(body).Response.story.allTime.secondsPlayed.basic.value)/60;
                            //console.log("storyMinutes:" + storyMinutes+"\n")
                            totalStoryMinutes += storyMinutes
                          }

                          if(!(Object.keys(JSON.parse(body).Response.allStrikes).length === 0 && JSON.parse(body).Response.allStrikes.constructor === Object))
                          {
                            var strikesMinutes = Number(JSON.parse(body).Response.allStrikes.allTime.secondsPlayed.basic.value)/60;
                            //console.log("strikesMinutes:" + strikesMinutes+"\n")
                            totalStrikesMinutes += strikesMinutes
                          }

                          //minutesPlayed += (pvpMinutes + patrolMinutes + raidMinutes + storyMinutes + strikesMinutes);
                          count++;
                          //console.log(minutesPlayed)
                          if(count == characterArray.length)
                          {
                            gatheringData = false;
                          }

                          if(!gatheringData)
                          {
                            message.channel.stopTyping()

                            // message.channel.send({embed : {color: 0x4dd52b,
                            //     description: `Total Hours Played: ${Math.floor(hoursPlayed)} \n
                            //                   Total PVP Time: ${Math.floor(totalPvpMinutes/60)} \n
                            //                   Total Patrol Time: ${Math.floor(totalPatrolMinutes/60)} \n
                            //                   Total Raid Time: ${Math.floor(totalRaidMinutes/60)} \n
                            //                   Total Story Time: ${Math.floor(totalStoryMinutes/60)} \n
                            //                   Total Strikes Time: ${Math.floor(totalStrikesMinutes/60)}`}})
                            hoursPlayed = Math.floor(totalPvpMinutes/60) + Math.floor(totalPatrolMinutes/60) +
                              Math.floor(totalRaidMinutes/60 )+ Math.floor(totalStoryMinutes/60) + Math.floor(totalStrikesMinutes/60)

                            message.channel.send({embed : {color: 0x4dd52b,
                                title: `Play time stats for  ${player}#${number}`,
                                fields: [{
                                  name: "Total Hours Played",
                                  value: hoursPlayed + " hours"
                                },
                                {
                                  name: "Total PVP Time",
                                  value: Math.floor(totalPvpMinutes/60) + " hours"
                                },
                                {
                                  name: "Total Patrol Time:",
                                  value: Math.floor(totalPatrolMinutes/60) + " hours"
                                },
                                {
                                  name: "Total Raid Time:",
                                  value: Math.floor(totalRaidMinutes/60) + " hours"
                                },
                                {
                                  name: "Total Story Time:",
                                  value: Math.floor(totalStoryMinutes/60) + " hours"
                                },
                                {
                                  name: "Total Strikes Time:",
                                  value: Math.floor(totalStrikesMinutes/60) + " hours"
                                },
                              ],
                              timestamp: new Date(),
                              footer: {
                                icon_url: client.user.avatarURL,
                                text: "Brought to you by Prometheus"
                              }
                            }});

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
