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

var client = new pasProto.pas.PASService(
  '0.0.0.0:50051',
  grpc.credentials.createInsecure()
);

function printResponse(error, response) {
  if (error)
    console.log('Error: ', error);
  else
    console.log(response);
}

function listUsers() {
  client.list({}, function (error, users) {
    /* for (var i = 0; i < users.users.length; i++) {
      console.log(users.users[i]);
    } */
    printResponse(error, users);
  });
}

function insertUser(personcode, firstname, lastname) {
  var user = {
    personcode: personcode,
    firstname: firstname,
    lastname: lastname,
    roles: []
  };
  client.insert(user, function (error, empty) {
    printResponse(error, empty);
  });
}

function getUser(personcode) {
  client.get({
    personcode: personcode
  }, function (error, user) {
    printResponse(error, user);
  });
}

function deleteUser(personcode) {
  client.delete({
    personcode: personcode
  }, function (error, empty) {
    printResponse(error, empty);
  });
}

function assignRole(personcode, role,
  event, startdate, enddate, status) {
  var roleassignment = {
    personcode: personcode,
    role: role,
    event: event,
    startdate: startdate,
    enddate: enddate,
    status: status
  };
  client.assignrole(
    roleassignment,
    function (error, empty) {
      printResponse(error, empty);
    });
}

/*
function watchUsers() {
  var call = client.watch({});
  call.on('data', function (user) {
    console.log(user);
  });
}
*/

var processName = process.argv.shift();
var scriptName = process.argv.shift();
var command = process.argv.shift();

if (command == 'list')
  listUsers();

else if (command == 'insert')
  insertUser(
    process.argv[0], // person_code
    process.argv[1], // first_name
    process.argv[2], // last_name
  );

else if (command == 'get')
  getUser(
    process.argv[0] // person_code
  );

else if (command == 'delete')
  deleteUser(
    process.argv[0] // person_code
  );

else if (command == 'assign')
  assignRole(
    process.argv[0], // person_code
    process.argv[1], // role
    process.argv[2], // event
    process.argv[3], // start_date
    process.argv[4], // end_state
    process.argv[5] // status
  );

// else if (command == 'watch')
//  watchUsers();
