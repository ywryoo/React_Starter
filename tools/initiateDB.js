/**
 * Created by Yangwook Ryoo on 2/3/16.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

 //this tests db setting is right
var mysql = require('mysql');
var db = require('./db.js');

let connection = mysql.createConnection(db.config);

connection.connect();

connection.query('SHOW VARIABLES LIKE "%version%";', (err, rows, fields) => {
  if (err) throw err;
  console.log('Version is ',rows);
});

connection.end();

/*
  babel -o dist/test.js tools/initiateDB.js
  babel -o dist/db.js src/db.js
  node dist/test.js
 */

//TODO make db script
