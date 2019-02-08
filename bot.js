const Discord = require('discord.js');
const client = new Discord.Client();


var winston = require('winston');
var auth = require('./auth.json');
var config = require('./config.json')
const fs = require('fs')
const googleClient = require('./GoogleAPI/client.js')
const skynet = require('./Skynet/skynet.js');
var skynetClient = "";


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

if(config.useSkynet){
  skynetClient = new skynet.skynetBase();

}

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
try{
  var customCommandList = require('./Commands/Misc/customCommandsSave.json')
}
catch(err){
  logger.info("Did not load custom commands file. Custom Commands will be disabled until this file is created.")
  logger.debug(err)
}

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
               'Ping Prometheus when I die']
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


  //playing ticker and check for new registration
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

      if(checkIfCustomCommand(command,message) == true){return;}

      if(config.useSkynet && message.content.indexOf('skynetSetup') != -1){
        skynetClient.setupConfig(message);
        return;
      }

      var folder = checkIfActive(command,message);

      //logger.debug("Loaded folder: " + folder)
      let commandFile = require(`./commands/${folder}/${command}.js`);

      commandFile.run(client, message, args);
    }
    catch (err) {
      if(message.content == config.prefix + "help") return;
     logger.debug('Error thrown when loading file: ' + err)
    }

});

client.on('guildMemberAdd', member => {
  if(config.useSkynet){
    skynetClient.addNewUserRole(client,member);
    return;
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

client.on('guildMemberUpdate',function(oldMember,newMember){
  if(!oldMember.roles.find("name", "T-800") && newMember.roles.find("name", "T-800")){
    var newMemberName = newMember.user.toString();
    client.channels.get(
      auth.
      homeTextChannel).send(`<@&${auth.ClanMember}> welcome ${newMemberName} to the clan!`);

    }
})

client.on('messageReactionAdd', (reaction, user) => {
    parseReaction(reaction, user)

  return;
});

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
    logger.info("Successive login attempts unsuccessful. Exiting bot @" + date.getHours() + ":" + date.getMinutes())
    process.exit()
  }
  return;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}



function changeDefaultRole(){
  var clanMembers = client.guilds.get(auth.home).members;

  clanMembers.forEach(function(guildMember,guildMemberID){
      if(guildMember.roles.has(auth.defaultRole))
      {
        guildMember.removeRole(auth.defaultRole);
        guildMember.addRole(auth.friendRole);
      }
    });
}

function checkIfCustomCommand(command_,message_){
    try  {
      fs.readFile('./Commands/Misc/customCommandsSave.json', (err, data) => {
      if (err) throw err;
      let jsonArray = JSON.parse(data);

      jsonArray.forEach(commandEntry =>{

        if(command_ == commandEntry.command.toLowerCase()){
            message_.channel.send(commandEntry.response)
            return true;
        }
        });
      })
    }
    catch(err){
      logger.debug("Problem loading custom command, error: " + err)
      return false;
    }
}


async function pingNewProspect(){

  if(client.guilds.get(auth.home).channels.get(
  auth.prospectiveClanMemberChannel).lastMessageID != null)
  {

    var lastMessage = await client.guilds.get(auth.home).channels.get(
      auth.prospectiveClanMemberChannel).fetchMessage(client.guilds.get(auth.home).channels.get(
        auth.prospectiveClanMemberChannel).lastMessageID);

        lastMessage.delete();
  }

    client.guilds.get(auth.home).channels.get(auth.prospectiveClanMemberChannel).send(
      `<@&${auth.onTheProcessor}> please read this page for more info about joining our clan.` );

    return;
}

function parseReaction(reaction_,user_){
  if(user_.id == client.user.id) return;
  if(reaction_.message.author.id !=client.user.id) return;
  if(checkForMatchingChannel(reaction_.message.channel.id,auth.setupChannel))
  {
    addUserRoleViaReaction(reaction_,user_);
  }
}

function addUserRoleViaReaction(reaction_,user_){
  //map emoji id to role
  var roleMap = new Map([
  ["377203230653939713",'350884452995694594'],//warlock
  ["377203229873930251",'350883091725811742'],//hunter
  ["377207705594757123",'373629204769669121'],//titan
  ["⚠",'479740347610562560'],//spoiler
  ["🔹",'351126070889807872'],//friend
  ["🔰",'377919983650471937']]);//prospect

  var roleNameMap = new Map([
  ["377203230653939713",'warlock'],//warlock
  ["377203229873930251",'hunter'],//hunter
  ["377207705594757123",'titan'],//titan
  ["🔹",'AMD Processor'],//friend
  ["🔰",'On The Processor']]);

  var member = client.guilds.get(auth.home).members.get(user_.id);
  var roleID = roleMap.get(reaction_.emoji.id);
  if (typeof roleID != 'undefined'){
    member.addRole(roleMap.get(reaction_.emoji.id)).then(user_.send(`Added the ${roleNameMap.get(reaction_.emoji.id)} role.`)).then(removeNewUserRole(member)).catch();
    return;
  }
  roleID = roleMap.get(reaction_.emoji.name);
  if (typeof roleID != 'undefined'){
    member.addRole(roleMap.get(reaction_.emoji.name)).then(user_.send(`Added the ${roleNameMap.get(reaction_.emoji.name)} role.`)).then(removeNewUserRole(member)).catch();
    return;
  }
}

function removeNewUserRole(member_){
  if(member_.roles.has(auth.defaultRole)){
    member_.removeRole(auth.defaultRole);
  }
}

function checkForMatchingChannel(channelID1,channelID2){
  return channelID1==channelID2;
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

function getRegistrationArray(){
  let registration = require("./GoogleAPI/Sheets/registration.js")
  return new Promise(function(resolve,reject){
    registration.getOutstandingRegistrations((regArray)=>{
      resolve(regArray);})
  });
}

async function checkForNewRegistration(){
  var regArray =  await getRegistrationArray();
  regArray.forEach(function(element) {
    if(element[4]!="Yes"){
    client.guilds.get(auth.home).channels.get(auth.modChannel).send({embed : {color: 0x4dd52b,
        description: `<@&${auth.modRole}> A New user would like to join the clan!
        \n **Discord Name**: ${element[1]}
        \n **Battle.net Name**: ${element[2]}
        \n **Found Us From**: ${element[3]}`,
        timestamp: new Date(),
        footer: {
          icon_url: client.user.avatarURL,
          text: "Brought to you by Prometheus"
        } }});
      }
  });

}
