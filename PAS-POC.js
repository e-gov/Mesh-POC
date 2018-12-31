var grpc = require('grpc');

var PROTO_PATH = __dirname + '/PAS.proto';

var protoLoader = require('@grpc/proto-loader');
var packageDefinition = protoLoader.loadSync(
  PROTO_PATH,
  {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
  });
var pasProto = grpc.loadPackageDefinition(
  packageDefinition);

// Deprecated:
// var pasProto = grpc.load('PAS.proto');

var events = require('events');
var usersStream = new events.EventEmitter();

// In-memory array of User objects
var users = [{
  personcode: 'EE36100000000',
  firstname: 'Aino',
  lastname: 'Kuusk',
  roles: []
}];

var server = new grpc.Server();

server.addService(
  pasProto.pas.PASService.service,
  {
    list: function (call, callback) {
      // call represents the request message
      // To respond to the method, call callback
      // providing an error object (or null) and
      // an object representing the response message.
      callback(null, { isikud: users });
    },
    insert: function (call, callback) {
      var person = call.request;
      users.push(person);
      usersStream.emit('new_book', person);
      callback(null, { opresultmessage: 'OK' });
    },
    get: function (call, callback) {
      for (var i = 0; i < users.length; i++)
        if (users[i].personcode == call.request.personcode)
          return callback(null, users[i]);
      callback({
        code: grpc.status.NOT_FOUND,
        details: 'Ei leia sellist kasutajat'
      });
    },
    delete: function (call, callback) {
      for (var i = 0; i < users.length; i++) {
        if (users[i].personcode == call.request.personcode) {
          users.splice(i, 1);
          return callback(null, { opresultmessage: 'OK' });
        }
      }
      callback({
        code: grpc.status.NOT_FOUND,
        details: 'Ei leia sellist kasutajat'
      });
    },
    assignrole: function (call, callback) {
      var personcode = call.request.personcode;
      var role = call.request.role;
      for (var i = 0; i < users.length; i++) {
        if (users[i].personcode == personcode) {
          console.log('Lisan rolli: ', role);
          users[i].roles.push(role);
          console.log('Kasutaja rollid: ', users[i].roles);
          return callback(null, { opresultmessage: 'OK'});
        }
      }
      callback(
        null, { opresultmessage: 'Ei leia sellist kasutajat' }
      );
    },
    watch: function (stream) {
      usersStream.on('new_book', function (person) {
        stream.write(person);
      });
    }
  });

server.bind(
  '0.0.0.0:50051',
  grpc.ServerCredentials.createInsecure()
);

server.start();
