module.exports = {
  cookie : {secret : 'sensibiloperSblog'},
  session : {
              secret : 'sensibiloperSblog',
              resave : false,
              saveUninitialized : true
            },
  admin : {
              id : 'sensibiloper',
              password : '1234'
            },
  dbConfig : {
    connectionLimit : 5,
    host : 'localhost',
    user : 'sensibiloper',
    database : 'sensibiloper',
    password : 'gPeisl613^'
  }
};
