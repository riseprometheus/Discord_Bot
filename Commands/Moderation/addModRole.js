exports.run = (client, message, args) => {
    var fs = require('fs');
    var modRolesString = '';
    var successFlag=false;
    fs.readFile('./Commands/modRoles.txt','utf8',function(err,contents){
      var spacer = ', ';
      if(contents.length == 0)
      {
        spacer = '';
      }
      message.member.roles.forEach(function(role,roleID){
         if(role.name =='@everyone') return;
         for(i=0;i<args.length; i++){
          if(i==0){
            modRolesString=args[i];
            if(modRolesString.length == role.name.length &&
              modRolesString.toLowerCase() == role.name.toLowerCase()){
              fs.appendFile('./Commands/modRoles.txt',(spacer + modRolesString), function (err) {
                if (err) throw err;
                successFlag=true;
                console.log('Saved new mod role!');
                return
              });
            }
          }
          else{
            modRolesString += (" " + args[i]);
            if(modRolesString.length == role.name.length &&
              modRolesString.toLowerCase() == role.name.toLowerCase()){
              fs.appendFile('./Commands/modRoles.txt',(spacer + modRolesString), function (err) {
                if (err) throw err;
                console.log('Saved new mod role!');
                successFlag = true;
                return;
              });
            }
          }
         }
        modRolesString='';
      });
      if(!successFlag){
        message.channel.send("It looks like the role you tried to add isn't setup on the server. Please try again.").
        catch(console.error);
      }
  });
}
