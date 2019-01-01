'use strict';

var kafka = require('kafka-node');
var Consumer = kafka.Consumer;
var Offset = kafka.Offset;
var argv = require('optimist').argv;
var topic = argv.topic || 'TutorialTopic';

// Moodusta Zookeeper-i klient
var Client = kafka.Client;
var client = new Client('localhost:2181');

// Moodusta tarbija
var topics = [ { topic: topic } ];
var options = {
  autoCommit: true,
  fetchMaxWaitMs: 1000,
  fetchMaxBytes: 1024 * 1024
};
var consumer = new Consumer(client, topics, options);

var offset = new Offset(client);

consumer.on('message', function (message) {
  console.log(message);
});

consumer.on('error', function (err) {
  console.log('error', err);
});

/**
* If consumer get `offsetOutOfRange` event, fetch data from the
* smallest(oldest) offset
*/
consumer.on('offsetOutOfRange', function (topic) {
  topic.maxNum = 2;
  offset.fetch([topic], function (err, offsets) {
    if (err) {
      return console.error(err);
    }
    var min = Math.min.apply(null, offsets[topic.topic][topic.partition]);
    consumer.setOffset(topic.topic, topic.partition, min);
  });
});