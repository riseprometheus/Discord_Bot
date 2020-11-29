'use strict';

class SQLWrapper {
    constructor(){
      this.init = true;
      this.timeout = 40000;
    }

    createPool = function(){
      const mysql = require('mysql2/promise');
      var mysqlConfig = require('../sqlconfig.json');
      this.pool = mysql.createPool({
        host: mysqlConfig.host,
        user: mysqlConfig.user,
        password : mysqlConfig.password,
        database: mysqlConfig.database,
        waitForConnections: true,
        connectionLimit: 3,
        queueLimit: 0
      });
    }

    getPool = function(){
      return this.pool;
    }
    execute = function(){
      this.pool.getConnection()
      .then(conn => {
        const res = conn.query('select foo from bar');
        conn.release();
        return res;
      }).then(result => {
        console.log(result[0][0].server_id);
      }).catch(err => {
        console.log(err); // any of connection time or query time errors from above
      });
    }
}

module.exports = SQLWrapper;
