const {google} = require('googleapis');
const googleClient = require('../client.js');
const fs = require('fs');
const config = require('config.json');

const TOKEN_PATH = 'token.json';
//Allows for information from a google form to be sent to user

async function getOutstandingRegistrations(callback) {
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return googleClient.getNewToken(googleClient.oAuth2Client, callback);
    googleClient.oAuth2Client.setCredentials(JSON.parse(token));

    const sheets = google.sheets({
      version: 'v4',
      auth: googleClient.oAuth2Client,
    });
    sheets.spreadsheets.values.get({
      spreadsheetId: config.spreadsheetID,
      range:'Sheet1',
    }, (err, res) => {
      if (err) return console.log('The API returned an error: ' + err);
      const rows = res.data.values;
      var regArray = [];
      if (rows.length) {
        //console.log('Timestamp,Discord User, Battle.net, Referal:');
        // Print columns A and E, which correspond to indices 0 and 4.
        rows.map((row) => {
          //console.log(`${row[0]}, ${row[1]},${row[2]},${row[3]}`);
          regArray.push([row[0],row[1],row[2],row[3],row[4]])
        });
      } else {
        console.log('No data found.');
      }
      var valueArray = [];

      regArray.forEach(function(element) {
          valueArray.push(['Yes']);
      });
      sheets.spreadsheets.values.update({
        spreadsheetId: config.spreadsheetID,
        range: `E2:E${regArray.length+1}`,
        valueInputOption: 'RAW',
        resource: {range: `E2:E${regArray.length+1}`,
                    majorDimension: 'ROWS',
                    values: valueArray}

        }, (err, result) => {
        if (err) {
          // Handle error
          console.log(err);
        } else {
          //console.log("Column update successful.");
        }
        });

      //return an array of currently outstanding registration requests.
      // TODO: Have api remove these entries from google form
      //console.log('Completed API Call');
      callback(regArray);
    });
  });
}


module.exports.getOutstandingRegistrations = getOutstandingRegistrations;
