var mysql = require('mysql');
var Q = require('q');
var credentials = require('../credentials');

console.log('why?whiy? '+mysql);

var dbConfig = credentials.dbConfig;
var dbConfig = credentials.testDbConfig;
console.log(dbConfig);
var pool = mysql.createPool(dbConfig);


function getConnection(){
  return Q.ninvoke(pool, 'getConnection');
}

function beginTransaction(connection){
  var defer = Q.defer();
  Q.ninvoke(connection, 'beginTransaction')
  .then(function(){
    defer.resolve(connection);
  })
  .fail(function(err){
    defer.reject(err);
  });
  return defer.promise;
}

function commit(connection, result){
  var defer = Q.defer();

  Q.ninvoke(connection, 'commit')
  .then(function(){
    defer.resolve(result);
  })
  .fail(function(err){
    defer.reject(err);
  });
  return defer.promise;
}

exports.pool = pool;
exports.mysql = mysql;

exports.getConnection = getConnection;
exports.beginTransaction = beginTransaction;
exports.commit = commit;
