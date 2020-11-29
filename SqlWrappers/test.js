var SQLWrapper = require('./SQLFunctions.js');
var mysqlConfig = require('../sqlconfig.json');
const handler = new SQLWrapper();


//let snowflake = "198269064064270356";
let server="518123964485206018";
let snowflake = "198269064064270356";
let newVIP = "155411836701769729";
var queryStr = `SELECT * FROM discord_sql_server.server_vips WHERE user_id = ? and server_id = ?` ;
var insert = `INSERT INTO discord_sql_server.server_vips( server_id, user_id) VALUES (?,?) `;;
console.log(queryStr);
/*
Order of operations
1.) Check if calling User is a vip
2.) Check if requested user is vip
3.) Add requested user as vip
*/

handler.createPool(); // or require('mysql2').createPoolPromise({}) or require('mysql2').createPool({}).promise()

handler.pool.getConnection()
  .then(conn => {
    console.log("Going to check if calling user is vip");
    const res = conn.query(queryStr,[snowflake,server]);
    conn.release();
    return res;
  }).then(res =>{
    if(res[0][0] !==undefined){
      console.log("They are a vip!")
      return;
    }
    throw new Error("User is not vip!");
  })
  .then(() => {
    return handler.pool.getConnection()
  })
  .then( conn =>{
    console.log("Going to check if requested user is vip");
    const res = conn.query(queryStr,[newVIP,server]);
    conn.release();
    return res;
  })
  .then(result =>{
    if(result[0][0] !==undefined){
        throw new Error("User is already vip!");
    }
    return;
  })
  .then(() => {
    return handler.pool.getConnection()
  })
  .then(conn =>{
    console.log("Going to add requested vip ");
    const res = conn.query(insert,[server,newVIP]);
    conn.release();
    console.log("Successfully added user")
    return res;
  })
  .catch(err =>{console.log(err.message)})


function checkIfNewVIP(){
  console.log("Going to check if new user is vip");
}
