var os = require('os');
var hostname = os.hostname();

var kafka = require('kafka-node');
var Producer = kafka.Producer;
var KeyedMessage = kafka.KeyedMessage;
var Client = kafka.Client;
var client = new Client('kafkaserveraddresshere:2181');
var argv = require('optimist').argv;
var topic = argv.topic || 'test';
var p = argv.p || 0;
var a = argv.a || 0;
var producer = new Producer(client, { requireAcks: 1 });

producer.on('ready', function () {
  var message = 'Tere! (sõnum masinast ' + hostname + ')';
  var keyedMessage = new KeyedMessage('keyed', 'Veel üks sõnum masinast ' + hostname);

  producer.send([
    { topic: topic, partition: p, messages: [message, keyedMessage], attributes: a }
  ], function (err, result) {
    console.log(err || result);
    process.exit();
  });
});

producer.on('error', function (err) {
  console.log('error', err);
});
