/* eslint-disable import/no-extraneous-dependencies */
const { resolve, parse } = require('path');
const http = require('http');
const fs = require('fs');

const { escapeRegExp, replace } = require('lodash');
const { to } = require('await-to-js');

const fsp = fs.promises;

const mikrotik = require('./bin/mikrotik').sort(
  (a, b) => a.name.length > b.name.length,
);

const server = http.createServer(async (req, res) => {
  const u = new URL(`http://${req.headers.host}${req.url}`);
  const path = resolve(__dirname, 'public', `.${u.pathname}`);
  const { ext } = parse(path);

  let mimeType = 'application/octet-stream';
  let doReplace = false;
  switch (ext.toLocaleLowerCase()) {
    case '.html':
      doReplace = true;
      mimeType = 'text/html';
      break;
    case '.txt':
      mimeType = 'text/plain';
      break;
    case '.svg':
      mimeType = 'image/svg+xml';
      break;
    case '.css':
      mimeType = 'text/css';
      break;
    case '.js':
      mimeType = 'application/javascript';
      break;
    default:
  }
  const [e, stat] = await to(fsp.stat(path));
  if (e || !stat.isFile()) {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Not found');
    return true;
  }

  res.statusCode = 200;
  res.setHeader('Content-Type', mimeType);

  if (doReplace) {
    let ctx = await fsp.readFile(path, { encoding: 'utf8' });
    mikrotik.forEach((item) => {
      ctx = replace(
        ctx,
        new RegExp(escapeRegExp(`$(${item.name})`), 'g'),
        item.fake(),
      );
    });
    res.end(ctx);
    return true;
  }
  fs.createReadStream(path).pipe(res);
  return true;
});

server.listen(9000);
