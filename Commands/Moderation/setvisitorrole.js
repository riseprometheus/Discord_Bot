exports.run = (client, message, args) => {
  const VIP = require('./vipInfo.js')
  const SQLHandler = require('../../SqlWrappers/SQLFunctions.js')
  const responseEmbed = require('../../ResponseTemplates/ResponseEmbed.js').getEmbedTemplate(client)
  if (args === undefined || args.length === 0) {
    // No role provided to bot
    message.channel.send(responseEmbed.setTitle('Uh oh!').setDescription('Please provide a role to set as your default new member role.'))
    return
  }
  var info = new VIP(message.author.id, message.guild.id)
  var handler = new SQLHandler()
  const vistorRole = message.mentions.roles.first().id
  info.checkVIP(handler)
    .then(() => {
      if (info.isVIP()) {
        // User is confirmed a vip and can set vistor role
        console.log('Confirmed vip. Setting Role')
      } else {
        message.channel.send(responseEmbed.setTitle('Uh oh!').setDescription('You don\'t have the correct permissions to run this command!'))
      }
    })
    .then(() => {
      // Check if a vistor role already exists
      console.log('Going to check if vistor role exists')
      return handler.createConnection()
    })
    .then((conn) => {
      const checkQuery = 'Select * FROM discord_sql_server.server_visitor_roles WHERE server_id = ?'
      var res = conn.query(checkQuery, message.guild.id)
      conn.end()
      return res
    })
    .then((res) => {
      if (res[0][0] !== undefined) {
        // Vistor role already set. Need to update instead of INSERT
        handler.createConnection()
          .then((conn) => {
            console.log('Server already has vistor role configured. Going to update record')
            const updateQuery = 'UPDATE discord_sql_server.server_visitor_roles SET role_id = ? WHERE server_id = ?'
            conn.query(updateQuery, [vistorRole, message.guild.id])
            conn.end()
          })
          .catch(e => {
            console.log(e.message)
          })
      } else {
        // No visitor role set. Insert new record
        console.log('No visitor role set. Going to insert new record')
        handler.createConnection()
          .then((conn) => {
            const insertQuery = 'INSERT INTO discord_sql_server.server_visitor_roles ( `server_id`, `role_id`) VALUES (?,?)'
            conn.query(insertQuery, [message.guild.id, vistorRole])
            conn.end()
          })
          .catch(e => {
            console.log(e.message)
          })
      }
    })
    .catch(e => {
      console.log(e.message)
    })
}
