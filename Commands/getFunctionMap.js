exports.run = (command) => {
    var dict = {"ping":"Misc",
                "time":"Misc",
                "guilddetails":"Misc",
                "sweep":"Misc",
                //Moderation Commands
                "getroles": "Moderation",
                "nickname": "Moderation",
                //Music
               "summon": "Music",
               "leave": "Music"};
    return dict[command];
 }
