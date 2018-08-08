const defaultMessages = require("./skynetMessages.json")

class skynetBase {
  constructor(config_)
  {
    this.homeGuildID = config_.home;
  }

  newRoleAdded()
  {
    console.log("New Role added to a user")
  }

  newMemberAdded(guildID_)
  {
      console.log(guildID_)
      if(this.homeGuildID == guildID_)
      {
        return new skynetFunctionData(true,defaultMessages.welcome);
      }
      return new skynetFunctionData(false,"Failure");
  }
}

class skynetFunctionData
{
  constructor(success_,messageString_)
  {
    this.isSucess = success_;
    this.messageString = messageString_;
  }

  getIsSuccess()
  {
    return this.isSucess;
  }

  getMessageString()
  {
    return this.messageString;
  }
}

module.exports = {
  skynetBase:skynetBase,
  skynetFunctionData:skynetFunctionData
}
