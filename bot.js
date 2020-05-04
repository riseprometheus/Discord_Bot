const Discord = require('discord.js');
const client = new Discord.Client();


var winston = require('winston');

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

logger.info("Going to load information from auth.json.");
var auth = loadConfig("auth.json");

logger.info("Going to load information from config.json.");
var config = loadConfig("config.json");

const fs = require('fs')
const googleClient = require('./GoogleAPI/client.js')


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

var botStartUpInfo = {
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
  const command = args.shift();
  try {
      // let functionFolder = require('./Commands/getFunctionMap.js');
      // var folder = functionFolder.run(command);
      if(message.content.indexOf('/') != -1 && command != "customcommand" && command !="sendtochannel" && "play"){
        message.reply("Please don't try to mess around with me too much.");
        return;
      }

      //// TODO: REBUILD HELP COMMAND
      checkIfHelp(command,message,args);

    }
    catch (err) {
      if(message.content == config.prefix + "help") return;
     logger.debug('Error thrown when loading file: ' + err)
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

client.on('guildMemberAdd', member => {
  try  {
    var myQuery = "SELECT * FROM discord_sql_server.new_member_roles WHERE server_snowflake = ?;";
    var connection = createSQLConnection();

    connection.connect(function(err) {
      if(err) {
        logger.debug('error when connecting to db:', err);
      }
    });

    var serverID = member.guild.id;
    connection.query({sql:myQuery,
                        timeout: 40000},[serverID], function (error, results, fields) {
      disconnect(connection);

      if (error){
        if(error.code === 'PROTOCOL_ENQUEUE_AFTER_FATAL_ERROR' ){
          message_.reply("Please try you command again.")
          return;
        }
        else{
          logger.debug("Non ENQUEUE error ", error);
          return;
        }
      }

    results.forEach(newMemberRole =>{
          member.addRole(newMemberRole.role_snowflake).catch().then(logger.info(`Added role ${newMemberRole.role_name} to ${member.user.username} on ${newMemberRole.server_name}`))
      });

    });

  }
  catch(err){

    return false;
  }
});

client.login(auth.token);

function checkIfHelp(command,message,args){

  let helpConn = createSQLConnection("config_database");
  if(!connect(helpConn)) return undefined;

  if(command == "help"){
    if(args.length > 0 ){
      let specCategoryString = `Here are the commands available in the **${args[0].toUpperCase()}** category: \n`;
      let categoryCommandsQuery = `SELECT command,help_text FROM bot_commands where module = \'${args[0]}\'`;
      helpConn.query({sql:categoryCommandsQuery,
                          timeout: 40000}, function (error, results, fields) {
        disconnect(helpConn);
        if(checkForError(error)) return;
        if(results.length > 0){
          results.forEach(comm=>{
            specCategoryString += `**${comm.command}**: *${comm.help_text}*\n`;
          })
          sendEmbedTemplate(message,specCategoryString,0x4dd52b);
        }else{
            sendEmbedTemplate(message,`It doesn't look like that is a valid help category. Please try again with one of the options from using the ${config.prefix}help command.`,0x4dd52b);
        }

      });

    }else{
      let disModuleQuery = 'SELECT distinct module FROM bot_commands';

      helpConn.query({sql:disModuleQuery,
                          timeout: 40000}, function (error, results, fields) {
        disconnect(helpConn);
        if(checkForError(error)) return;
        let categoriesString = `Type ${config.prefix}help <CATEGORY> from one of the categories below to see all commands in that category. \n` ;

        results.forEach( category =>{
          categoriesString +=`**${category.module}**\n`;
        });
        sendEmbedTemplate(message,categoriesString,0x4dd52b);
      });
    }
  }else{
    checkIfActive(command,message,args);
  }

}



 function checkIfActive(command,message,args){
  let configSQLConn = createSQLConnection("config_database");
  if(!connect(configSQLConn)) return undefined;

  let configQuery = `SELECT active, module FROM bot_commands WHERE command = '${command}'`;
  configSQLConn.query({sql:configQuery,
                      timeout: 40000}, function (error, results, fields) {
    disconnect(configSQLConn);
    if(checkForError(error)) return;


    if(results.length >0){
      if(results[0].active === 1){
            //Command is active.
            logger.debug(`Successfully returned active result for ${command} in module ${results[0].module}.`)
            //logger.debug("Loaded folder: " + folder)
            let commandFile = require(`./Commands/${results[0].module}/${command.toLowerCase()}.js`);
            commandFile.run(client, message, args);

        }else{
          //returned hidden command
          logger.debug("Returned hidden command.");
          sendEmbedTemplate(message,`${config.prefix}${command} doesn't seem to be a valid command. Please use ${config.prefix}help to see a valid list of commands.`,0x4dd52b);
        }
    }else if(results.length == 0){
      checkIfCustomCommand(command,message,args)
    }


  });
}

function checkIfCustomCommand(command,message,args){

      var myQuery = "SELECT * FROM discord_sql_server.server_custom_commands WHERE server_id = ?;";
      let ccConn = createSQLConnection();

      if(!connect(ccConn)) return;


      var serverID = message.guild.id;
      ccConn.query({sql:myQuery,
                          timeout: 40000},[serverID], function (error, results, fields) {
        disconnect(ccConn);
        if(checkForError(error)) return;

        results.forEach(commandEntry =>{

          if(command == commandEntry.command.toLowerCase()){
              message.channel.send(commandEntry.embed_link);
              return true;
          }
        });

      });

}

function respondToDM(message){
  message.reply("Thank you for messaging the Bot. The owner will get back to you soon.");
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


function loadConfig(fileName){
  try {
      var mod = require(`./${fileName}`);
      logger.info(`Sucessfully loaded ${fileName}.`);
      return mod;
  } catch (e) {
      if (e.code !== 'MODULE_NOT_FOUND') {
          throw e;
      }
      logger.info(`${fileName} not found. Closing bot.js`);
  }
}

function createSQLConnection(db="database"){
  return mysql.createConnection({
    host     : mysqlConfig.host,
    user     : mysqlConfig.user,
    password : mysqlConfig.password,
    database : mysqlConfig[db]
  });
}

function connect(conn){
  let result = true;
  conn.connect(function(err) {
    if(err) {
      logger.debug('error when connecting to db', err);
      result = false;
    }

  });

  return result;
}

function disconnect(conn){
  conn.end(function(err) {
    if(err) {
      logger.debug('error when disconnecting from db:', err);
    }
  });
}

function checkForError(err){
  if (err){
    if(err.code === 'PROTOCOL_ENQUEUE_AFTER_FATAL_ERROR' ){
      logger.debug("Enqueue Error");
      return true;
    }
    else{
      logger.debug("Non ENQUEUE error ", err);
      return true;
    }
  }
  return false;
}

function sendEmbedTemplate(message,msgText,color){
  message.channel.send({embed : {color: 0x4dd52b,
    description: msgText}}).catch(console.error);
}
