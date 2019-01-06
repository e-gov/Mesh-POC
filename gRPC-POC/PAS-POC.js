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

// Teenuse teostus
server.addService(
  pasProto.pas.PASService.service,
  {
    list: function (call, callback) {
      // call represents the request message
      // To respond to the method, call callback
      // providing an error object (or null) and
      // an object representing the response message.
      callback(null, { users: users });
    },

    insert: function (call, callback) {
      var person = call.request;
      users.push(person);
      usersStream.emit('new_user', person);
      callback(
        null,
        { op_result: 'OK' }
      );
    },

    get: function (call, callback) {
      for (var i = 0; i < users.length; i++)
        if (users[i].personcode == call.request.personcode)
          return callback(
            null,
            {
              op_result: 'OK',
              user_found: users[i]
            }
          );
      callback(
        null,
        {
          op_result: 'Ei leia sellist kasutajat',
          user_found: null
        }
      );
    },

    delete: function (call, callback) {
      for (var i = 0; i < users.length; i++) {
        if (users[i].personcode == call.request.personcode) {
          users.splice(i, 1);
          return callback(null, { opresultmessage: 'OK' });
        }
      }
      callback(null,
        { opresultmessage: 'Ei leia sellist kasutajat' });
    },

    assignrole: function (call, callback) {
      var roleassignment = {
        role: call.request.role,
        event: call.request.event,
        startdate: call.request.startdate,
        enddate: call.request.enddate,
        status: call.request.status
      };
      personcode = call.request.personcode;
      for (var i = 0; i < users.length; i++) {
        if (users[i].personcode == personcode) {
          users[i].roles.push(roleassignment);
          return callback(
            null,
            { opresultmessage: 'OK' }
          );
        }
      }
      callback(
        null,
        { opresultmessage: 'Ei leia sellist kasutajat' }
      );
    },

    /*
    watch: function (stream) {
      usersStream.on('new_user', function (person) {
        stream.write(person);
      });
    }
    */
  });

server.bind(
  '0.0.0.0:50051',
  grpc.ServerCredentials.createInsecure()
);

server.start();
console.log('PAS-POC Access Control Server Started');
