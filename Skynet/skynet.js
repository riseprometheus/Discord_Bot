const defaultMessages = require("./skynetMessages.json")
const importantRoles = require("./serverConfig.json")

class skynetBase {
  constructor(auth_,config_)
  {
    this.homeGuildID = auth_.home;
    this.debugStatus = config_.debug;
    this.debugUser   = auth_.debugUser;
<<<<<<< HEAD
    this.reactionRoleID = {
        "🔰":"377919983650471937", // TODO: Put these in config
        "🔹":"351126070889807872",// TODO: put these in config
        "377207705594757123":"373629204769669121", //titan
        "377203229873930251":"350883091725811742",//hunter
        "377203230653939713":"350884452995694594"//warlock
    };
=======
>>>>>>> 25c7efe14bc105899e307ccaf80e073191d3073b
  }

  newRoleAdded()
  {
    console.log("New Role added to a user")
  }

  isSkynet(guildID_)
  {
     return guildID_ == this.homeGuildID;
  }

  newMemberAdded(guildID_)
  {
      if(this.homeGuildID == guildID_)
      {
        return new skynetFunctionData(true,defaultMessages.general);
      }
      return new skynetFunctionData(false,"Failure");
  }

  checkIfDebug(userID_)
  {
      if(this.debugStatus)
      {
        // console.log('This User: '+userID_)
        // console.log('Debug User: '+ this.debugUser)
        if(userID_ == this.debugUser)
        {

          return true; //send message if user is test account
        }
        return false //don't send message if debug is on and user is not test acount
      }
      return true; //send message when debug is turned off
  }

  beginSetup(userID_)
  {
      if(this.checkIfDebug(userID_))
      {
        var reactions = ["🔰","🔹"]
        return new skynetFunctionData(true,defaultMessages.welcome+ "\n" + defaultMessages.prospect + "\n" + defaultMessages.friendOf,reactions )
      }
      //console.log("Non Debug user triggered this event.")
      return new skynetFunctionData(false);
  }

  setupFinalString(reactionID)
  {

    if(reactionID == importantRoles.onTheProcessor)
    {
      return new skynetFunctionData(true,defaultMessages.final + "\n" + defaultMessages.bungieNET);
    }
    return new skynetFunctionData(true,defaultMessages.final);
  }

   getNewRoleKickString()
   {
     return defaultMessages.roleKick
   }

   getSpoilerRole(guildID_,reaction_)
   {
     if(this.isSkynet(guildID_) && reaction_ == "⚠")
     {
       return new skynetFunctionData(true,importantRoles.spoilerRole)
     }
     return new skynetFunctionData(false,"")
   }

}
class skynetFunctionData
{
  constructor(success_,messageString_ ="",reactionArry_ = {})
  {
    this.isSucess = success_;
    this.messageString = messageString_;
    this.reactionArray = reactionArry_;
  }

  getIsSuccess()
  {
    return this.isSucess;
  }

  getMessageString()
  {
    return this.messageString;
  }

  getReactionArray()
  {
    return this.reactionArray;
  }
}

module.exports = {
  skynetBase:skynetBase,
  skynetFunctionData:skynetFunctionData
}
