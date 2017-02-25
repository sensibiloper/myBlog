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
    connectionLimit : 3,
    host : 'localhost',
    user : 'sensibiloper',
    database : 'blog',
    password : 'gPeisl613^'
  }
};
