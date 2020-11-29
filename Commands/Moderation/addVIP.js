exports.run = (client, message,args) => {
  const sqlHandler = require('../../SqlWrappers/SQLFunctions.js');
  const responseTemplate = require('../../bot.js');
  let responseEmbed = responseTemplate.getEmbedTemplate();

  var handler = new sqlHandler();

  handler.createPool(); // or require('mysql2').createPoolPromise({}) or require('mysql2').createPool({}).promise()
  var serverID = message.guild.id;
  var caller = message.author.id;
  var vip = message.mentions.members.first().id;

  var queryStr = `SELECT * FROM discord_sql_server.server_vips WHERE user_id = ? and server_id = ?` ;
  var insert = `INSERT INTO discord_sql_server.server_vips( server_id, user_id) VALUES (?,?) `;

  handler.pool.getConnection()
    .then(conn => {
      //console.log("Going to check if calling user is vip");
      const res = conn.query(queryStr,[caller,serverID]);
      conn.release();
      return res;
    }).then(res =>{
      if(res[0][0] !==undefined){
        //console.log("They are a vip!")
        return;
      }
      message.channel.send(responseEmbed.setTitle("You don't have permission to run this command!").setDescription("Please have a vip user run this command to continue."))
      throw new Error("Calling user is not a vip.");
    })
    .then(() => {
      return handler.pool.getConnection()
    })
    .then( conn =>{
      //console.log("Going to check if requested user is vip");
      const res = conn.query(queryStr,[vip,serverID]);
      conn.release();
      return res;
    })
    .then(result =>{
      if(result[0][0] !==undefined){
          message.channel.send(responseEmbed.setTitle("Uh oh!").setDescription(`User <@${vip}> is already a vip!`));
          throw new Error("Unable to add vip. Requested user is already vip.");
      }
      return;
    })
    .then(() => {
      return handler.pool.getConnection()
    })
    .then(conn =>{
      //console.log("Going to add requested vip ");
      const res = conn.query(insert,[serverID,vip]);
      conn.release();
      //console.log("Successfully added user")
      message.channel.send(responseEmbed.setTitle("Success!").setDescription(`User <@${vip}> has been added as a vip!`))
      return res;
    })
    .catch(err =>{console.log(err.message)})
  return;
}
