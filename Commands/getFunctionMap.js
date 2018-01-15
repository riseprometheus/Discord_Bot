exports.run = (command) => {
    var dict = {"ping":"Misc",
                "time":"Misc",
                "guilddetails":"Misc",
                //Moderation Commands
                "getroles": "Moderation"};
    return dict[command];
 }
