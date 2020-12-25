'use strict'

class SQLWrapper {
  constructor () {
    this.init = true
    this.timeout = 40000
    this.mysql = require('mysql2/promise')
    this.mysqlConfig = require('../sqlconfig.json')
  }

  createPool () {
    const mysql = require('mysql2/promise')
    var mysqlConfig = require('../sqlconfig.json')
    this.pool = mysql.createPool({
      host: mysqlConfig.host,
      user: mysqlConfig.user,
      password: mysqlConfig.password,
      database: mysqlConfig.database,
      waitForConnections: true,
      connectionLimit: 3,
      queueLimit: 0
    })
  }

  createConnection () {
    this.conn = this.mysql.createConnection({
      host: this.mysqlConfig.host,
      user: this.mysqlConfig.user,
      password: this.mysqlConfig.password,
      database: this.mysqlConfig.database
    })
    return this.conn
  }

  getPool () {
    return this.pool
  }
}

module.exports = SQLWrapper
