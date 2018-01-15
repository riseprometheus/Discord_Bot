exports.run = (client, message,args) => {
    var rolesString ='';
    console.log(message.member.roles.size);
    //console.log(message.member.roles);
    message.member.roles.forEach(function(role,roleID){
      if(role.name != '@everyone'){

          if(rolesString=='')
          {
            rolesString += (' '+role.name);
          }
          else
          {
            rolesString +=(', '+role.name);
          }
        }
    })

    message.channel.send("Your roles on this server are:" + rolesString).catch(console.error);
 }
