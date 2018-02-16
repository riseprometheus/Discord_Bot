exports.run = (client, message,args) => {
  var upperBound = 0;
  if(args[0]>1000000){
  message.channel.send("I can only go so high. Try a lower number.");
  return;}
  if(args.length == 0){upperBound = 99;}
  else{upperBound = args[0];}
  message.channel.send("Your random number is " + Math.floor((Math.random() * upperBound+1))+".");
}
