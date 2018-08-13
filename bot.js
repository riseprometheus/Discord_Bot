const Discord = require('discord.js');
const client = new Discord.Client();


var winston = require('winston');
var auth = require('./auth.json');
var config = require('./config.json')

const skynetModule = require('./Skynet/skynet.js')
const skynet = new skynetModule.skynetBase(auth,config);

var masterCommandList = require('./Commands/masterCommandList.json')
var activites = [`on ${client.guilds.size} servers`,'ask ?help','Ping Prometheus when I die']
var currentlyAttemptingLogin = false;
var loggedIn = false;
var date = new Date();

var emojiMap =
[
  {key: 0,value:'Moderation'},
  {key: 1,value:'Games'},
  {key: 2,value:'Misc'},
  {key: 3,value:'Hank'},
  {key: 4,value:'Anime'},
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

client.on('ready', () => {
  logger.debug('Hello there!');
  logger.debug(`Connected to ${client.guilds.size} server(s)`);
  logger.info("Starting up at: " + date.getHours() + ":" + date.getMinutes())
  client.user.setGame(`Bot is starting up`);
  var counter = 0;

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

  var interal2 = setInterval(function(){ // Set interval for checking
       // Create a Date object to find out what time it is
      if(date.getHours() === 8 && date.getMinutes() === 00)
      { // Check the time
          logger.debug("Beginning specified role purge.")
          userRolePurge()
      }
  }, 60000); //


});

client.on('message', message => {
  if(botHelpResponse(message) == true){//why doesn't if(botHelpResponse(message)) not work?
    return;
  };
  if(reactToMessage(message,["🔰","🔹"]) == true)
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
  if(message.content.indexOf('/') != -1){
    message.reply("Please don't try to mess around with me too much.");
    return;
  }
  //check if dm
  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  try {
      // let functionFolder = require('./Commands/getFunctionMap.js');
      // var folder = functionFolder.run(command);
      if(checkIfHelp(command,message)){
        return;
      };

      var folder = checkIfActive(command,message);
      //console.log(folder);
      let commandFile = require(`./commands/${folder}/${command}.js`);
      commandFile.run(client, message, args);
    } catch (err) {
      if(message.content == config.prefix + "help")return;
    }

});


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
            description:setUpData.getMessageString() }})
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
      homeTextChannel).send(`@everyone welcome ${newMemberName} to the clan!`);

    }
})

client.login(auth.token);



function checkIfHelp(command,message)
{
  if(command == "help"){
    sendMainMenu(message)
    return true;
  }
  return false;
}

function botHelpResponse(message)
{
    if(message.author.id !=client.user.id ) return false;

    message.embeds.forEach((embed)=>{

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
          var categoryString = emojiMap[filterEmojiArray.indexOf(reaction.emoji.name)].value
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
      })

      return false;
  }

function checkIfActive(command,message)
{
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

function respondToDM(message)
{
  message.reply("Thank you for messaging the Bot. The owner will get back to you soon.");
}

function sendMainMenu(message)
{
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

function editMainMenu(message)
{
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

function editMenuPerCategory(commandCategory,message)
{
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

async function attemptLogin(client)
{
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

async function reactToMessage(message,reactions)
{

  if(message.author.id !=client.user.id )
  {
    return false;
  }

  if(message.embeds.length == 0)
  {
    return false;
  }

  if(message.embeds[0])

    if(message.embeds[0].description.indexOf("Welcome to Skynet!")>=0)
    {
      for (const emoji of reactions)
      {
        await message.react(emoji);
      }
      return true;
    }
    return false;

}


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

        }
    }
});


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function setupBaseRoles(userID, reactionName)
{
  var skynetUser = client.guilds.get(auth.home).members.get(userID);
  var dm = await skynetUser.createDM()
  dm.startTyping();
  var finalMessage = skynet.setupFinalString(reactionRoleID[reactionName])
  await skynetUser.addRoles(reactionRoleID[reactionName])
  await skynetUser.removeRole(auth.defaultRole)
  await sleep(2000)
  dm.stopTyping()
  await skynetUser.user.send(
    {embed : {color: 0x4dd52b,
        description:finalMessage.getMessageString() }})
}

function userRolePurge()
{
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
