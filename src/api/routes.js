/**
 * Created by Yangwook Ryoo on 2/14/16.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import {Router} from 'express';
import bodyParser from 'body-parser';
import mysql from 'mysql';
//import * as db from '../constants/db.js';

const router = new Router();
//const connection = mysql.createConnection(db.config);

//json
router.use(bodyParser.json());

//temp routing
router.route('/comments')
.post(async (req, res, next) => {
  try {
  req.app.set(req.app.get('data').push(req.body));
  res.status(200).send(req.app.get('data'));
  } catch(err) {
    next(err);
  }
})
.get(async (req, res, next) => {
  try{
  res.send(JSON.stringify(req.app.get('data')));
  } catch (err) {
    next(err);
  }
});

export {router as default};