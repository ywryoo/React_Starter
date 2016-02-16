/**
 * Created by Yangwook Ryoo on 1/29/16.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import express from 'express';
import helmet from 'helmet';
import apiroutes from './api/routes';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import Html from './components/Html.react';

const server = express();

let env = process.env.NODE_ENV || 'development';
let port = 4321;
//default: development

if (env == 'production') {
  port = 3000;
} //production env
if (env == 'staging') {
  port = 4322;
} //staging env

//temp values
server.set("data", [
    {id:1, author: "Pete Hunt", text: "댓글입니다."},
    {id:2, author: "Jordan Walke", text: "*또 다른* 댓글입니다."}
  ]);

//defend basic attacks
server.use(helmet());
//static files
server.use(express.static(process.env.NODE_PATH + '/public')); //TODO add favicon, robots, etc.
//api routes
server.use('/api', apiroutes);

server.get('*', async (req, res, next) => {
  try {
    const html = ReactDOMServer.renderToString(<Html />);
    res.send('<!DOCTYPE HTML>\n' + html);
  } catch (err) {
    next(err);
  }
});

server.listen(port, () => {
  console.log('server listening on %d!', port);
});