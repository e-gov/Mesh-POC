/**
 * Teenus
 * 
 * Rakendus on mõeldud ülespanekuks kahe eraldi teenusena
 * (Teenus 1 ja 2). Kummana paigaldis töötab, määratakse
 * käivitusparameetriga.
 * 
 * Teenused on sümmeetrilised. Teenus ootab HTTP GET pöördumisi ja:
 * - marsruudile / vastab oma elutukseteabega
 * - marsruudi /naaber korral pärib teiselt teenuselt elutukseteabe
 *   ja edastab selle pöördujale.
 * 
 * Elutukse kirjes on teenuse nimi ajamärge (timestamp).
 * 
 * Käivitamine:
 * node teenus <teenusenimi> <masinanimi> <port> <secure>
 * 
 * kus:
 * - <teenusenimi> on teenust eristav number
 * paigaldatud. (Kasutame seda võtet ainult selleks, et võtmed
 * ei satuks koos koodiga GitHub-i)
 * - <port> on paigaldise port.
 * - <secure> teeb HTTPS serveri (muidu HTTP)
 * 
 * Eeldused:
 * - võtmed kaustas ../keys
 * - Express, request
 */

'use strict';

const os = require('os');
const https = require('https'); // HTTPS (Node.js)
const http = require('http'); // HTTP (Node.js)
const fs = require('fs'); // Sertide laadimiseks
const path = require('path');
const request = require('request'); // Envoy poole pöördumiseks

const express = require('express'); // Veebiraamistik Express

// Expressi ettevalmistamine
const app = express();

// Haara käivitusparameetrid: teenusenimi, port, [secure]
if (process.argv.length > 3) {
  var TEENUSENIMI = process.argv[2];
  var HOSTNAME = os.hostname();
  var PORT = process.argv[3];
}
else {
  console.log('Kasutamine: ' +
    'node teenus <teenusenimi> <port> [secure]');
  return
}
if (process.argv[5] && process.argv[5] == 'secure') {
  var SECURE = true;
}
else {
  var SECURE = false;
}
function logi(logikirje) {
  var date = new Date();
  var fdate = date.toLocaleString();
  console.log(
    TEENUSENIMI + ' (' +
    HOSTNAME + ': ' + PORT + ') : ' +
    fdate + ' : ' +
    logikirje
  );
}

/** Väljasta elutukse. Pöörduda võib nii Välisvahendaja (Edge)
 * kui ka teine teenus.
 * Väljastab teenusenumbri, hostinime ja pordi, kus kuulab
*/
app.get('/',
  function (req, res) {
    logi('Väljastan elutukse');
    res.send(
      TEENUSENIMI +
      ' kuuldel (' + HOSTNAME + ':' + PORT + ') '
    );
  }
);

app.get('/monkey',
  function (req, res) {
    logi('Väljastan elutukse');
    res.send(
      TEENUSENIMI +
      ' kuuldel (' + HOSTNAME + ':' + PORT + ') '
    );
  }
);

app.get('/banana',
  function (req, res) {
    logi('Väljastan elutukse');
    res.send(
      TEENUSENIMI +
      ' kuuldel (' + HOSTNAME + ':' + PORT + ') '
    );
  }
);

/** Töötle pöördumine, mis nõuab, et päriksid teiselt teenuselt
 * elutukseteabe ja saadaksid selle koos oma kommentaariga
 * pöördujale.
 * /getbanana reageerib ainult pöördujale Monkey
 * 
*/
app.get('/monkey/getbanana',
  function (req, res) {
    logi('Lähen banaani hankima');
    // Pöördumine Envoy kaudu Banaaniteenusesse
    const options = {
      url: 'http://localhost:5100/banana/getbanana'
      // ,
      // headers: {
      //   'Host': 'Mesh'
      // }
    }
    function callback(error, response, body) {
      if (!error && response.statusCode == 200) {
        logi('Sain banaani - ' + body);
        res.send(
          TEENUSENIMI + ' (' + HOSTNAME + ':' + PORT + ') ' +
          ': ' + body
        );
        return;
      }
      else {
        logi('Annan ahvile banaani');
        res.send(
          TEENUSENIMI + ' (' + HOSTNAME + ':' + PORT + ') ' +
          ': ' + JSON.stringify(error)
        );
      }
    }
    request(options, callback);
  }
);

app.get('/banana/getbanana',
  function (req, res) {
    res.send(
      TEENUSENIMI + ' (' + HOSTNAME + ':' + PORT + ') ' +
      ': Please, your banana!'
    );
  }
);

if (SECURE) {
  // Valmista ette HTTPS serveri suvandid - võtmetega seonduv
  var HTTPS_S_options = {

    // Usaldusankrud
    ca: fs.readFileSync(
      path.join(__dirname, '..', 'keys',
        "ca-SELF.cert"), 'utf8'),

    // HTTPS serveri privaatvõti
    key: fs.readFileSync(
      path.join(__dirname, '..', 'keys',
        HOSTNAME + '-SELF.key'), 'utf8'),

    // HTTPS serveri sert
    cert: fs.readFileSync(
      path.join(__dirname, '..', 'keys',
        HOSTNAME + '-SELF.cert'), 'utf8'),

    requestCert: false,
    rejectUnauthorized: false
  };

  // Loo server, määra Express töötlejaks
  var httpsServer = https.createServer(HTTPS_S_options, app);

  // Käivita HTTPS server 
  httpsServer.listen(
    PORT,
    () => {
      console.log(
        TEENUSENIMI + ' (' +
        HOSTNAME + ': ' + httpServer.address().port + ') :' +
        'kuuldel');
    }
  );

}
else {
  var HTTP_options = {};
  // Loo server, määra Express töötlejaks
  var httpServer = http.createServer(app);
  // Käivita HTTP server
  httpServer.listen(
    PORT,
    () => {
      console.log(
        TEENUSENIMI + ' (' +
        HOSTNAME + ': ' + httpServer.address().port + ') :' +
        'kuuldel');
    }
  );

}
