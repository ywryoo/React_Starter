/**
 * Created by Yangwook Ryoo on 1/29/16.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import express from 'express';
import path from 'path';
import mysql from 'mysql';
import helmet from 'helmet';
import * as db from './db.js';

const app = express();
const connection = mysql.createConnection(db.config);

let env = process.env.NODE_ENV || 'development';
let port = 4321;
//default: development

if (env == 'production') {
  port = 3000;
} //production env
if (env == 'staging') {
  port = 4322;
} //staging env

//static files
app.use(express.static(process.env.NODE_PATH + '/public'));
app.use(helmet());

app.get('/', (req, res) => {
  res.sendFile(process.env.NODE_PATH + '/public/index.html');
});

app.listen(port, () => {
  console.log('app listening on %d!', port);
});
//TODO add route and middleware
