/**
 * EdgeProxy (välisvahendaja) 
 * 
 * Edge vahendab välismaailmast mikroteenusvõrgu poole pöördumisi.
 * Ta kuulab HTTPS pordil ja suunab pöördumise vastavasse teenusesse
 * (POC-is teenusesse 1). Teenusest saadud vastuse edastab pöördujale.
 * 
 * Käivitamine:
 * node edgeProxy <masinanimi> <port>
 * 
 * kus <masinanimi> on masina nimi, kuhu instants on
 * paigaldatud. (Kasutame seda võtet ainult selleks, et võtmed
 * ei satuks koos koodiga GitHub-i).
 * 
 * Eeldused:
 * - võtmed kaustas ../keys
 * - Express
 */

'use strict';

const https = require('https'); // HTTPS (Node.js)
const fs = require('fs'); // Sertide laadimiseks
const path = require('path');

const express = require('express'); // Veebiraamistik Express

// Expressi ettevalmistamine
const app = express();

// Töötle pöördumine
app.get('/',
  (req, res) => {
    var date = new Date();
    var fdate = date.toLocaleString();
    console.log('Edge Proxy/' + hostName + ': ' + fdate);
    res.send('Edge Proxy/' + hostName + ': ' + fdate);
  });

// Töötle pöördumine Teenuse 1 poole
app.get('/teenus1',
  (req, res) => {
    // TODO: pöördumine Envoy poole
  });

// Töötle pöördumine Teenuse 2 poole
app.get('/teenus2',
  (req, res) => {
    // TODO: pöördumine Envoy poole
  });

// Haara masinanimi
if (process.argv.length > 3) {
  var hostName = process.argv[2];
  var port = process.argv[3];
}
else {
  console.log('Kasutamine: node edgeProxy <masinanimi> <port>');
  return
}

// Valmista ette HTTPS serveri suvandid - võtmetega seonduv
var HTTPS_S_options = {

  // Usaldusankrud
  ca: fs.readFileSync(
    path.join(__dirname, '..', 'keys',
      "ca-SELF.cert"), 'utf8'),

  // HTTPS serveri privaatvõti
  key: fs.readFileSync(
    path.join(__dirname, '..', 'keys',
      hostName + '-SELF.key'), 'utf8'),

  // HTTPS serveri sert
  cert: fs.readFileSync(
    path.join(__dirname, '..', 'keys',
      hostName + '-SELF.cert'), 'utf8'),

  requestCert: false,
  rejectUnauthorized: false
};

// Loo server, määra Express töötlejaks
var httpsServer = https.createServer(HTTPS_S_options, app);

// Käivita HTTPS server 
httpsServer.listen(
  port,
  () => {
    console.log(
      'Edge Proxy/' + hostName + ': ' +
      'Kuulan pordil: ' + httpsServer.address().port);
  });


