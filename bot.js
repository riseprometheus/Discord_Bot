const Discord = require('discord.js');
const client = new Discord.Client();


var winston = require('winston');
var auth = require('./auth.json');
var config = require('./config.json')
const fs = require('fs')

<<<<<<< HEAD
//info for winson
=======
>>>>>>> 25c7efe14bc105899e307ccaf80e073191d3073b
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

const skynetModule = require('./Skynet/skynet.js')
const skynet = new skynetModule.skynetBase(auth,config);

<<<<<<< HEAD
//Checking for master command list
try{
  var masterCommandList = require('./Commands/masterCommandList.json')
}
catch(err){
=======
try
{
  var masterCommandList = require('./Commands/masterCommandList.json')
}
catch(err)
{
>>>>>>> 25c7efe14bc105899e307ccaf80e073191d3073b
  logger.info("Did not load master command list. Shutting down.")
  process.exit()
}

<<<<<<< HEAD
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
=======

try
{
  var customCommandList = require('./Commands/Misc/customCommandsSave.json')
}
catch(err)
{
>>>>>>> 25c7efe14bc105899e307ccaf80e073191d3073b
  logger.info("Did not load custom commands file. Custom Commands will be disabled until this file is created.")
  logger.debug(err)
}

<<<<<<< HEAD
var botStartUpInfo = {
  emojiMap:[
=======

var activites = [`on ${client.guilds.size} servers`,'ask ?help','Ping Prometheus when I die']
var currentlyAttemptingLogin = false;
var loggedIn = false;
var date = new Date();

var emojiMap =
[
>>>>>>> 25c7efe14bc105899e307ccaf80e073191d3073b
  {key: 0,value:'Moderation'},
  {key: 1,value:'Games'},
  {key: 2,value:'Misc'},
  {key: 3,value:'Hank'},
  {key: 4,value:'Anime'},
<<<<<<< HEAD
  {key: 5,value:'Back'}],
  activities: [`on ${client.guilds.size} servers`,
               'ask ?help',
               'Ping Prometheus when I die']
};

var currentlyAttemptingLogin = false;
var loggedIn = false;


=======
  {key: 5,value:'Back'}
];

var reactionRoleID =
{
    "🔰":"377919983650471937", // TODO: Put these in config
    "🔹":"351126070889807872",// TODO: put these in config
    "377207705594757123":"373629204769669121", //titan
    "377203229873930251":"350883091725811742",//hunter
    "377203230653939713":"350884452995694594"//warlock
};

>>>>>>> 25c7efe14bc105899e307ccaf80e073191d3073b

client.on('ready', () => {
  logger.debug('Hello there!');
  logger.debug(`Connected to ${client.guilds.size} server(s)`);
<<<<<<< HEAD
  var dateStart = new Date();
  logger.info("Starting up at: " + dateStart.getHours() + ":" + dateStart.getMinutes())
=======
  logger.info("Starting up at: " + date.getHours() + ":" + date.getMinutes())
>>>>>>> 25c7efe14bc105899e307ccaf80e073191d3073b
  client.user.setGame(`Bot is starting up`);
  var counter = 0;
  resetRoleChannel();

<<<<<<< HEAD
  //playing ticker
  var interval1 = setInterval(function(){
    botTickerLoop(counter);
  },15*1000)
  //Specific timed events
  var interval2 = setInterval(function(){
      var date = new Date();
      //logger.debug(`Hours: ${date.getHours()} Minutes:${date.getMinutes()}`)
      if(date.getHours() === 16 && date.getMinutes() === 30)
      { // Check the time
          logger.info("Auto Setting Role");
          changeDefaultRole();
      }
      if(date.getHours() === 16 && date.getMinutes() === 30)
      { // Check the time
          pingNewProspect();
      }

  }, 60000);
  //todo make this not have to be updated everyday
  var interval3 = setInterval(function(){
    resetRoleChannel();
  }, 3600000);
=======
  var interval1 = setInterval(function()
  {
    if(counter == 0)
    {
      activites[counter] = `on ${client.guilds.size} servers`;
    }
    client.user.setGame(activites[counter])
    if(counter < activites.length-1)
    {
      counter++
    }
    else
    {
      counter = 0
    }
  },15*1000)

  var interval2 = setInterval(function(){ // Set interval for checking

      if(date.getHours() === 18 && date.getMinutes() === 15)
      { // Check the time
          logger.debug("Beginning specified role purge.")
          userRolePurge()
      }
  }, 60000); //

  var interval3 = setInterval(function(){ // Set interval for checking
    resetRoleChannel();
  }, 3600000); //
>>>>>>> 25c7efe14bc105899e307ccaf80e073191d3073b


});

client.on('message', message => {
  if(botHelpResponse(message) == true){//why doesn't if(botHelpResponse(message)) not work?
    return;
  };
  if(reactToMessage(message,["🔰","🔹"]) == true)
  {
    return;
  }
  if(reactToMessage(message,["⚠"]) == true)
  {
    return;
  }

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
<<<<<<< HEAD
      if(message.content.indexOf('/') != -1 && command != "customcommand" && command != "play"){
=======
      if(message.content.indexOf('/') != -1 && command != "customcommand"){
>>>>>>> 25c7efe14bc105899e307ccaf80e073191d3073b
        message.reply("Please don't try to mess around with me too much.");
        return;
      }

      if(checkIfHelp(command,message)){
        return;
      };

      if(checkIfCustomCommand(command,message) == true)
      {
        return;
      }

      var folder = checkIfActive(command,message);


      //logger.debug("Loaded folder: " + folder)
      let commandFile = require(`./commands/${folder}/${command}.js`);


      commandFile.run(client, message, args);
    }
    catch (err) {
      if(message.content == config.prefix + "help") return;
     //logger.debug('Error thrown when loading file: ' + err)
    }

});

<<<<<<< HEAD
=======

>>>>>>> 25c7efe14bc105899e307ccaf80e073191d3073b
client.on('guildMemberAdd', member => {
  var skynetData = skynet.newMemberAdded(member.guild.id)
  if(skynetData.getIsSuccess())
  {
    member.addRole(auth.defaultRole) //// TODO: move to config_
    sleep(1500)
    var setUpData = skynet.beginSetup(member.id)
    if(!skynet.checkIfDebug(member.id))
    {
      member.user.send(skynetData.getMessageString())
    }

    if(setUpData.getIsSuccess())
    {
      member.user.send(
        {embed : {color: 0x4dd52b,
<<<<<<< HEAD
            description:setUpData.getMessageString() }}).then(logger.info(`Message sent to ${member.user.toString()}. Awaiting Response.`))
=======
            description:setUpData.getMessageString() }})
>>>>>>> 25c7efe14bc105899e307ccaf80e073191d3073b
    }
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
<<<<<<< HEAD
      homeTextChannel).send(`<@&${auth.ClanMember}> welcome ${newMemberName} to the clan!`);
=======
      homeTextChannel).send(`@everyone welcome ${newMemberName} to the clan!`);
>>>>>>> 25c7efe14bc105899e307ccaf80e073191d3073b

    }
})

<<<<<<< HEAD
client.on('messageReactionAdd', (reaction, user) => {
  parseReaction(reaction, user);
});

=======
>>>>>>> 25c7efe14bc105899e307ccaf80e073191d3073b
client.login(auth.token);



<<<<<<< HEAD
function checkIfHelp(command,message){
=======
function checkIfHelp(command,message)
{
>>>>>>> 25c7efe14bc105899e307ccaf80e073191d3073b
  if(command == "help"){
    sendMainMenu(message)
    return true;
  }
  return false;
}

<<<<<<< HEAD
function botHelpResponse(message){
=======
function botHelpResponse(message)
{
>>>>>>> 25c7efe14bc105899e307ccaf80e073191d3073b
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
<<<<<<< HEAD
            var categoryString = botStartUpInfo.emojiMap[filterEmojiArray.indexOf(reaction.emoji.name)].value
=======
            var categoryString = emojiMap[filterEmojiArray.indexOf(reaction.emoji.name)].value
>>>>>>> 25c7efe14bc105899e307ccaf80e073191d3073b
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

<<<<<<< HEAD
function checkIfActive(command,message){
=======
function checkIfActive(command,message)
{
>>>>>>> 25c7efe14bc105899e307ccaf80e073191d3073b
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

<<<<<<< HEAD
function respondToDM(message){
  message.reply("Thank you for messaging the Bot. The owner will get back to you soon.");
}

function sendMainMenu(message){
=======
function respondToDM(message)
{
  message.reply("Thank you for messaging the Bot. The owner will get back to you soon.");
}

function sendMainMenu(message)
{
>>>>>>> 25c7efe14bc105899e307ccaf80e073191d3073b
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

<<<<<<< HEAD
function editMainMenu(message){
=======
function editMainMenu(message)
{
>>>>>>> 25c7efe14bc105899e307ccaf80e073191d3073b
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

<<<<<<< HEAD
function editMenuPerCategory(commandCategory,message){
=======
function editMenuPerCategory(commandCategory,message)
{
>>>>>>> 25c7efe14bc105899e307ccaf80e073191d3073b
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

<<<<<<< HEAD
async function attemptLogin(client){
=======
async function attemptLogin(client)
{
>>>>>>> 25c7efe14bc105899e307ccaf80e073191d3073b
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

<<<<<<< HEAD
async function reactToMessage(message,reactions){
=======
async function reactToMessage(message,reactions)
{
>>>>>>> 25c7efe14bc105899e307ccaf80e073191d3073b

  if(message.author.id !=client.user.id )
  {
    return false;
  }

  if(message.embeds.length == 0)
  {
    return false;
  }

  if(message.embeds[0].url != null)
  {
    return false;
  }

  if(message.embeds[0].description == null)
  {
    return;
  }

  if(message.embeds[0])
  {
    if(message.embeds[0].description.indexOf("Welcome to Skynet!")>=0)
    {
      if(reactions[0] ==="🔰")
      {
        for (const emoji of reactions)
        {
          await message.react(emoji);
        }
        return true;
      }
    }

    if(message.embeds[0].description.indexOf("React with ⚠")>=0)
    {

      if(reactions[0] ==="⚠")
      {
        for (const emoji of reactions)
        {
          await message.react(emoji);
        }
        return true;
      }
    }
  }

  return false;
}

<<<<<<< HEAD
=======

client.on('messageReactionAdd', (reaction, user) => {
    if(user.id == client.user.id) return;
    if(reaction.message.author.id !=client.user.id) return;

    if(reaction.emoji.name in reactionRoleID && reaction.message.embeds.length != 0
      && reaction.message.embeds[0].description.indexOf("Welcome to Skynet!")>=0)
    {
        if (reaction.emoji.name in reactionRoleID)
        {
           logger.info("Going to set up roles for " + user.username)
           setupBaseRoles(user.id,reaction.emoji.name);
           return;
        }
    }

    var spoilerData = skynet.getSpoilerRole(reaction.message.guild.id, reaction.emoji.name)
    if(spoilerData.getIsSuccess())
    {
      var skynetUser = client.guilds.get(auth.home).members.get(user.id);

      if(skynetUser.roles.has(spoilerData.getMessageString()))
      {
        return;
      }
      skynetUser.addRoles(spoilerData.getMessageString())

      skynetUser.user.send(
        {embed : {color: 0x4dd52b,
            description:"Spoiler role added." }})
    }
});


>>>>>>> 25c7efe14bc105899e307ccaf80e073191d3073b
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

<<<<<<< HEAD
async function setupBaseRoles(userID, reactionName){
  var skynetUser = client.guilds.get(auth.home).members.get(userID);
  var dm = await skynetUser.createDM()
  dm.startTyping();
  var finalMessage = skynet.setupFinalString(skynet.reactionRoleID[reactionName])
  await skynetUser.addRoles(skynet.reactionRoleID[reactionName])
=======
async function setupBaseRoles(userID, reactionName)
{
  var skynetUser = client.guilds.get(auth.home).members.get(userID);
  var dm = await skynetUser.createDM()
  dm.startTyping();
  var finalMessage = skynet.setupFinalString(reactionRoleID[reactionName])
  await skynetUser.addRoles(reactionRoleID[reactionName])
>>>>>>> 25c7efe14bc105899e307ccaf80e073191d3073b
  await skynetUser.removeRole(auth.defaultRole)
  await sleep(2000)
  dm.stopTyping()
  await skynetUser.user.send(
    {embed : {color: 0x4dd52b,
        description:finalMessage.getMessageString() }})
}

<<<<<<< HEAD
function userRolePurge(){
=======
function userRolePurge()
{
>>>>>>> 25c7efe14bc105899e307ccaf80e073191d3073b
  var userKickedString = ""
  var numOfUsers = 0
  var verb = " were "
  var clanMembers = client.guilds.get(auth.home).members

  clanMembers.forEach(function(guildMember,guildMemberID)
  {
      if(guildMember.roles.has(auth.defaultRole))
      {
        if((Date.now()-guildMember.joinedTimestamp) > 86400000) //1 day = 86400000
        {
          try{
          guildMember.user.send(skynet.getNewRoleKickString()).
          then(userKickedString +=(" "+guildMember.user.username) ).
          then(guildMember.kick())
          numOfUsers++
          }
          catch(error)
          {
            client.guilds.get(auth.home).channels.get(auth.homeTextChannel).send(`@${guildMember.nickname} Please set up your roles before you are kicked by an @T-1000`)
          }
        }
      }
  })
  if(userKickedString.length == 0)
  {
    userKickedString = "0 members"
  }
  if(numOfUsers ==1)
  {
    verb = " was "
  }
  client.guilds.get(auth.home).channels.get(auth.modChannel).send(userKickedString + verb +"removed for not setting up their roles.")

}

<<<<<<< HEAD
function changeDefaultRole(){
  var clanMembers = client.guilds.get(auth.home).members;

  clanMembers.forEach(function(guildMember,guildMemberID)
  {
      if(guildMember.roles.has(auth.defaultRole))
      {
        guildMember.removeRole(auth.defaultRole);
        guildMember.addRole(auth.friendRole);
      }
    });
}

function checkIfCustomCommand(command_,message_){
=======
function checkIfCustomCommand(command_,message_)
{
>>>>>>> 25c7efe14bc105899e307ccaf80e073191d3073b
    try
    {
      fs.readFile('./Commands/Misc/customCommandsSave.json', (err, data) => {
      if (err) throw err;
      let jsonArray = JSON.parse(data);

      jsonArray.forEach(commandEntry =>{

        if(command_ == commandEntry.command.toLowerCase())
        {
            message_.channel.send(commandEntry.response)
            return true;
        }
        });

      })

    }
    catch(err)
    {
      logger.debug("Problem loading custom command, error: " + err)
      return false;
    }

}

<<<<<<< HEAD
async function resetRoleChannel(){
=======
async function resetRoleChannel()
{
>>>>>>> 25c7efe14bc105899e307ccaf80e073191d3073b
  if(client.guilds.get(auth.home).channels.get(
  auth.roleChannel).lastMessageID != null)
  {
    var lastMessage = await client.guilds.get(auth.home).channels.get(
      auth.roleChannel).fetchMessage(client.guilds.get(auth.home).channels.get(
        auth.roleChannel).lastMessageID);

        lastMessage.delete();
  }

    client.guilds.get(auth.home).channels.get(auth.roleChannel).send(
      {embed : {color: 0x4dd52b,
          description:"React with ⚠ if you would like the spoiler role for this server." }})

    return;
}
<<<<<<< HEAD

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

  if(reaction_.emoji.name in skynet.reactionRoleID && reaction_.message.embeds.length != 0
    && reaction_.message.embeds[0].description.indexOf("Welcome to Skynet!")>=0)
  {
      if (reaction_.emoji.name in skynet.reactionRoleID)
      {
         logger.info("Going to set up roles for " + user_.username)
         setupBaseRoles(user_.id,reaction.emoji.name);
         return;
      }
  }
  var guildID = 0
  if(reaction_.message.guild != null)
  {
      guildID = reaction_.message.guild.id;
  }
  var spoilerData = skynet.getSpoilerRole(guildID, reaction_.emoji.name)
  if(spoilerData.getIsSuccess())
  {
    var skynetUser = client.guilds.get(auth.home).members.get(user_.id);

    if(skynetUser.roles.has(spoilerData.getMessageString()))
    {
      return;
    }
    skynetUser.addRoles(spoilerData.getMessageString())

    skynetUser.user.send(
      {embed : {color: 0x4dd52b,
          description:"Spoiler role added." }})
  }
}

function botTickerLoop(counter_){
  if(counter_ == 0)
  {
    botStartUpInfo.activities[counter_] = `on ${client.guilds.size} servers`;
  }
  client.user.setGame(botStartUpInfo.activities[counter_])
  if(counter_ < botStartUpInfo.activities.length-1)
  {
    counter_++
  }
  else
  {
    counter_ = 0
  }
}
=======
>>>>>>> 25c7efe14bc105899e307ccaf80e073191d3073b
