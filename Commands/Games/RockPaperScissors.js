exports.run = (client, message,args) => {
  var userChoice = args[0].toLowerCase();
  var possibleBotChoices = ["rock","paper","scissors"];
  var botChoice = possibleBotChoices[Math.floor((Math.random() * 3))];
  if(userChoice == botChoice)
  {
    message.channel.send("You and the bot chose the same option! Try again!").catch(console.error);
    return;
  }
  console.log("success")
  var winningScenarios = [["rock","scissors"],["scissors","paper"],["paper","rock"]];
  var didYouWin = winningScenarios.find(function(element){
    var pair = [userChoice,botChoice];
    if(element[0] == pair[0] && element[1] == pair[1]){
      return true;
    }
  });
  if(didYouWin != undefined)
  {message.channel.send(
    "You chose: " + userChoice + " and the bot chose: " + botChoice +". Congrats, you win!").catch(console.error); }
  else{message.channel.send(
    "You chose: " + userChoice + " and the bot chose: " + botChoice +". Try again next time!").catch(console.error); }
}
