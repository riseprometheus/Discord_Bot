exports.run = (command) => {
    var dict = {"ping":"Misc",
                "time":"Misc",
                "guilddetails":"Misc",
                "sweep":"Misc",
                "killme":"Misc",
                "help":"Misc",
                //Moderation Commands
                "getroles": "Moderation",
                "nickname": "Moderation",
                //Music
               "summon": "Music",
               "leave": "Music",
               //hank
               "hankhello":"Hank",
               "hankwhite":"Hank",
               //Anime sounds
               "nani":"Anime"};
    return dict[command];
 }
