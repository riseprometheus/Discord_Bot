const Discord = require('discord.js');
const client = new Discord.Client();

var logger = require('winston');
var auth = require('./auth.json');
var config = require('./config.json')
var masterCommandList = require('./Commands/masterCommandList.json')
// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';

client.on('ready', () => {
  logger.info('Hello there!');
  logger.info(`Connected to ${client.guilds.size} server(s)`);
  client.user.setGame(`on ${client.guilds.size} servers`);
});

client.on('message', message => {
  if(message.author.bot) return;
  if(message.content.indexOf(config.prefix) !== 0) return;
  if(message.content.indexOf('/') != -1){
    message.reply("Please don't try to mess around with me too much.");
    return;
  }

  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  try {
      // let functionFolder = require('./Commands/getFunctionMap.js');
      // var folder = functionFolder.run(command);


      if(checkIfHelp(command,message)){
        return;
      };
      var folder = checkIfActive(command,message);
      console.log(folder);
      let commandFile = require(`./commands/${folder}/${command}.js`);
      commandFile.run(client, message, args);
    } catch (err) {
      logger.info(message.content + " is not a valid command" + '\r\n' + err)
    }

});


client.on('guildMemberAdd', member => {
  const channel = member.guild.channels.find('name', 'member-log');
  if (!channel) return;
  channel.send(`Welcome to the server, ${member}`);
});

client.login(auth.token);

function checkIfHelp(command,message){
  if(command == "helpbot"){
    var helpString = '';
    var spacer = ' ';
    for(i in masterCommandList){

      if(masterCommandList[i].active == false ||  masterCommandList[i].hidden == true)
      {continue;}

      helpString += "`"+config.prefix + masterCommandList[i].command +"`" + ": " +
      masterCommandList[i].help +"\n\n";

    }
    message.channel.send(helpString);
    return true;
  }
  return false;
}

function checkIfActive(command,message)
{
  for(i in masterCommandList){
    if(masterCommandList[i].command == command)
    {
      if(masterCommandList[i].active == false)
      {
        message.channel.send("Command is disabled by Admin.");
        return '';
      }
      return masterCommandList[i].subfolder;
    }
  }
  logger.info(message.content + " is not a valid command")
}
