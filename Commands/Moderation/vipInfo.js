'use strict'

class VIPInfo {
  constructor (userID, serverID) {
    this.vipUser = false
    this.user_id = String(userID)
    this.server_id = String(serverID)
  }

  isVIP () { return this.vipUser }

  async checkVIP (handler) {
    const checkQuery = 'SELECT * FROM discord_sql_server.server_vips WHERE user_id = ? and server_id = ?'
    // Get DB connection

    return await handler.createConnection()
      .then((conn) => {
        const params = [this.user_id, this.server_id]
        const res = conn.query(checkQuery, params)
        conn.end()
        return res
      })
      .then((res) => {
        if (res[0][0] !== undefined) {
          this.vipUser = true
          return
        }
        throw new Error('Calling user is not a vip.')
      })
      .catch(e => { console.log(e.message) })
  }
}

module.exports = VIPInfo
