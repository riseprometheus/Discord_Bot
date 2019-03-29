exports.run = async (client, message,args) => {
    var request = require('request')
    var auth = require('./../../auth.json')

    const HOST = 'https://www.bungie.net/Platform/Destiny2/';
    var characterIDArray = [];
    var count = 0;
    var gatheringData = true;
    var playerID = ""

    if (args === undefined || args.length == 0) {
      message.reply("Please provide a Battle.Net ID for me to search for.")
      message.channel.stopTyping();
      return;
    }
    var baseRequest = request.defaults({headers: {'X-API-Key':auth.destinyAPI}});
    var player = args[0].split("#")[0];
    var number = args[0].split("#")[1];
    console.log(player+"#"+number)
    try{
      baseRequest(HOST + 'SearchDestinyPlayer/4/' + player +'%23'+ number+'/',
  			  function (err, response, body) {
            try{
            playerID = JSON.parse(body).Response[0].membershipId;
            }
            catch(error)
            {
              message.reply("Sorry it looks like there was a problem retreiving that info from the Destiny Api.")
              return;
            }
            console.log(playerID)
            baseRequest(HOST + '4/Profile/' + playerID + '/?components=100',
        			  function (err, response, body) {
                  try
                  {
                  characterIDArray = JSON.parse(body).Response.profile.data.characterIds;
                  }
                  catch(error)
                  {
                    message.reply("Sorry it looks like there was a problem retreiving that info from the Destiny Api.")
                    return
                  }
                  var minutesPlayed = 0;
                  //console.log('start: ' +minutesPlayed)
                  characterIDArray.forEach((characterID)=>
                  {
                    baseRequest(HOST + '4/Profile/' + playerID + '/Character/' + characterID +'/?components=200',
                			  function (err, response, body) {
                          //console.log(`Minutes for ${count} ` + JSON.parse(body).Response.character.data.minutesPlayedTotal)
                          //.log(Number(JSON.parse(body).Response.character.data.minutesPlayedTotal))
                          var minutes = Number(JSON.parse(body).Response.character.data.minutesPlayedTotal);
                          minutesPlayed += minutes;
                          count++;
                          if(count == characterIDArray.length)
                          {
                            gatheringData = false;
                          }

                          if(!gatheringData)
                          {
                            var hoursPlayed = minutesPlayed/60;
                            message.channel.send('Total hours played (including idle time): ' + Math.ceil(hoursPlayed))
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
