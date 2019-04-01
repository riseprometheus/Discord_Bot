const Discord = require('discord.js');
const client = new Discord.Client();


var winston = require('winston');
var auth = require('./auth.json');
var config = require('./config.json')
const fs = require('fs')
const googleClient = require('./GoogleAPI/client.js')

//info for winson
const logger = winston.createLogger({
  levels: winston.config.syslog.levels,
  transports: [
    new winston.transports.Console({ level: 'debug',
    format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()) }),
    new winston.transports.File({
      filename: 'combined.log',
      level: 'info'
    })
  ]
});


//Checking for master command list
try{
  var masterCommandList = require('./Commands/masterCommandList.json')
}
catch(err){
  logger.info("Did not load master command list. Shutting down.")
  process.exit()
}

//Checking for google api module
try {
  const {google} = require('googleapis');
}
catch (e) {
  logger.info("Unable to load google Api module. Continueing with limited functionality")
}

//checking for custom command list
var mysql      = require('mysql');
var mysqlConfig = require('./sqlconfig.json')

var connection = mysql.createConnection({
  host     : mysqlConfig.host,
  user     : mysqlConfig.user,
  password : mysqlConfig.password,
  database : mysqlConfig.database
});

connection.on('error', function(err) {
    if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
      logger.debug(`Connection to DB has been lost at ${new Date()}`)
      handleDisconnect();                         // lost due to either server restart, or a
    } else {                                      // connnection idle timeout (the wait_timeout
      console.log("SQL server connection lost. check if server is running.")                                 // server variable configures this)
    }
  });

var botStartUpInfo = {
  emojiMap:[
  {key: 0,value:'Moderation'},
  {key: 1,value:'Games'},
  {key: 2,value:'Misc'},
  {key: 3,value:'Hank'},
  {key: 4,value:'Anime'},
  {key: 5,value:'Back'}],
  activities: [`on ${client.guilds.size} servers`,
               'ask ?help',
               'Ping Prometheus when I die',
               'try out ?showGameRoles']
};

var currentlyAttemptingLogin = false;
var loggedIn = false;



client.on('ready', () => {
  logger.debug('Hello there!');
  logger.debug(`Connected to ${client.guilds.size} server(s)`);
  var dateStart = new Date();
  logger.info("Starting up at: " + dateStart.getHours() + ":" + dateStart.getMinutes())
  client.user.setActivity('Bot is starting up', { type: 'WATCHING:' });
  var botInfo = {counter: 0};


  //playing ticker
  var interval1 = setInterval(function(){
    botTickerLoop(botInfo);
  },15*1000)

});

client.on('message', message => {
  if(botHelpResponse(message) == true){//why doesn't if(botHelpResponse(message)) not work?
    return;
  };

  if(message.author.bot) return;

  if(message.guild == null && message.content.indexOf(config.prefix) !== 0)
  {
    message.channel.startTyping();
    setTimeout(function(){respondToDM(message)},1000);
    message.channel.stopTyping();
    return;
  }

  if(message.content.indexOf(config.prefix) !== 0) return;

  //check if dm
  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  try {
      // let functionFolder = require('./Commands/getFunctionMap.js');
      // var folder = functionFolder.run(command);
      if(message.content.indexOf('/') != -1 && command != "customcommand" && command !="sendtochannel" && "play"){
        message.reply("Please don't try to mess around with me too much.");
        return;
      }

      if(checkIfHelp(command,message)){return;};

      if(checkIfCustomCommand(connection,command,message) == true){return;}

      var folder = checkIfActive(command,message);

      //logger.debug("Loaded folder: " + folder)
      let commandFile = require(`./Commands/${folder}/${command.toLowerCase()}.js`);

      commandFile.run(client, message, args);
    }
    catch (err) {
      if(message.content == config.prefix + "help") return;
     //logger.debug('Error thrown when loading file: ' + err)
    }

});

client.on('disconnect', function(){
  logger.debug("Bot has disconnected. Attempting to restart.")
  loggedIn = false;
  attemptLogin(client)
})

client.on('error',function(err){
  if(err.message == "read ECONNRESET" && !currentlyAttemptingLogin)
  {
    loggedIn = false;
    attemptLogin(client);
    return;
  }

  if(err.message == "read ECONNRESET" && currentlyAttemptingLogin)
  {
    loggedIn = false;
    logger.debug("Still Attempting to login.")
    return;
  }

  if(currentlyAttemptingLogin)
  {
    return;
  }
  logger.debug("Bot has crashed. Not attempting restart. @" +date.getHours() + ":" + date.getMinutes())

  process.exit()
})

client.on('resume',function(err){
  currentlyAttemptingLogin = false;
  loggedIn = true;
  logger.debug("Successfully logged back in. Resuming duties.");
})

client.login(auth.token);

function checkIfHelp(command,message){
  if(command == "help"){
    sendMainMenu(message)
    return true;
  }
  return false;
}

function botHelpResponse(message){
    if(message.author.id !=client.user.id ) return false;

    message.embeds.forEach((embed)=>{
      if(embed.url != null)
      {
        return;
      }

      if(embed.description == null)
      {
        return;
      }

      try
      {
        if(embed.description.indexOf("HELP MENU")>=0)
        {
          var filterEmojiArray = ['💼','🎮','❓','🤠','🗡','⬅'];

          message.react(filterEmojiArray[0])
          .then(()=>message.react(filterEmojiArray[1]))
          .then(()=>message.react(filterEmojiArray[2]))
          .then(()=>message.react(filterEmojiArray[3]))
          .then(()=>message.react(filterEmojiArray[4]))


        const filter = (reaction,user)=> {
          return filterEmojiArray.includes(reaction.emoji.name) && user.id !=client.user.id;
        }


        const collector = message.createReactionCollector(filter, { time: 60000 });

        collector.on('collect', (reaction, reactionCollector) => {
            var categoryString = botStartUpInfo.emojiMap[filterEmojiArray.indexOf(reaction.emoji.name)].value
            if(categoryString == 'Back')
            {
              editMainMenu(message)
            }
            else
            {
              editMenuPerCategory(categoryString,message)
            }

        });

        collector.on('end', collected => {
          message.reply('Signing off. If you need anything else, please send your command again.')
        });


            return true
          }
      }
      catch(err)
      {
        //console.log("Was not a bot function")
        return;
      }
      })

      return false;
  }

function checkIfActive(command,message){
  for(i in masterCommandList){
    if(masterCommandList[i].command.toLowerCase() == command)
    {
      if(masterCommandList[i].active == false)
      {
        message.channel.send("Command is disabled by Admin.");
        return '';
      }
      return masterCommandList[i].subfolder;
    }
  }
  if(message.content == config.prefix + "help")return;
}

function respondToDM(message){
  message.reply("Thank you for messaging the Bot. The owner will get back to you soon.");
}

function sendMainMenu(message){
  message.author.send({embed : {color: 0x4dd52b,
      description: "**HELP MENU** \n"+
      "What would you like to know more about? \n" +
      ":briefcase: Moderation \n"+
      ":video_game: Games \n" +
      ":question: Misc \n" +
      ":cowboy: Hank \n"+
      ":dagger: Anime"}})
      return
}

function editMainMenu(message){
  message.edit({embed : {color: 0x4dd52b,
      description: "**HELP MENU** \n"+
      "What would you like to know more about? \n" +
      ":briefcase: Moderation \n"+
      ":video_game: Games \n" +
      ":question: Misc \n" +
      ":cowboy: Hank \n"+
      ":dagger: Anime"}})
      return
}

function editMenuPerCategory(commandCategory,message){
    var helpString = '';
    var spacer = ' ';
    for(i in masterCommandList){

      if(masterCommandList[i].active == false ||  masterCommandList[i].hidden == true
      || masterCommandList[i].subfolder != commandCategory)
      {continue;}

      helpString += "`"+config.prefix + masterCommandList[i].command +"`" + ": " +
      masterCommandList[i].help +"\n\n";

    }
    if(helpString.length>0)
    {
      message.edit({embed : {color: 0x4dd52b,
          description: helpString}})
          .then(()=>message.react('⬅'))

    }
    return
}

async function attemptLogin(client){
  logger.debug("Starting login Attempts")
  var loginAttempts = 0;
  var maxLoginAttempts = 10;

  currentlyAttemptingLogin = true;
  for(loginAttempts = 1; loginAttempts <=maxLoginAttempts; loginAttempts++)

      try
      {
        logger.debug(`Attempting login #${loginAttempts}`)
        await sleep(30000)

        if(loggedIn)
        {
          return;
        }
        continue;
      }
      catch(err)
      {
        if(loginAttempts==maxLoginAttempts)
        {
          currentlyAttemptingLogin = false;
        }

        logger.debug(`Login attempt ${loginAttempts} has failed. Trying again.`)
        await sleep(10000)
      }

  if(!loggedIn)
  {
    logger.info(`Successive login attempts unsuccessful. Exiting bot @ ${new Date()}`)
    process.exit()
  }
  return;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function checkIfCustomCommand(connection_,command_,message_){
    try  {
      var myQuery = "SELECT * FROM discord_sql_server.server_custom_commands WHERE server_id = ?;";

      connection.connect(function(err) {
        if(err) {
          console.log('error when connecting to db:', err);
          setTimeout(handleDisconnect, 2000);
        }
      });

      var serverID = message_.guild.id;
      connection.query({sql:myQuery,
                          timeout: 40000},[serverID], function (error, results, fields) {
        if (error){
          if(error.code === 'PROTOCOL_ENQUEUE_AFTER_FATAL_ERROR' ){
            handleDisconnect();
            message_.reply("Please try you command again.")
            return;
          }
          else{
          console.log(error);
          return;
          }
        }

      results.forEach(commandEntry =>{

        if(command_ == commandEntry.command.toLowerCase()){
            message_.channel.send(commandEntry.embed_link);
            return true;
        }
        });
      });
      connection.end();
    }
    catch(err){
      logger.debug("Problem loading custom command, error: " + err);
      connection.end(function(err) {
        if(err) {
          console.log('error when disconnecting from db:', err);
          setTimeout(handleDisconnect, 2000);
        }
      });
      return false;
    }
}

function botTickerLoop(botInfo){
  if(botInfo.counter == 0)
  {
    botStartUpInfo.activities[botInfo.counter] = `on ${client.guilds.size} servers`;
  }
  client.user.setActivity(botStartUpInfo.activities[botInfo.counter], { type: 'WATCHING' })
  if(botInfo.counter < botStartUpInfo.activities.length-1)
  {
    botInfo.counter++
  }
  else
  {
    botInfo.counter = 0
  }
}

function handleDisconnect() {
  connection = mysql.createConnection({
    host     : mysqlConfig.host,
    user     : mysqlConfig.user,
    password : mysqlConfig.password,
    database : mysqlConfig.database
  });

  connection.connect(function(err) {
    if(err) {
      console.log('error when connecting to db:', err);
    }
  });

  connection.on('error', function(err) {
      if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
        logger.debug(`Connection to DB has been lost at ${new Date()}`)
                        // lost due to either server restart, or a
      } else {                                      // connnection idle timeout (the wait_timeout
        console.log("Couldn't reconnect to mysql server.")                                 // server variable configures this)
      }
    });

}
