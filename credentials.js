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
    host : '10.0.0.1',
    user : 'sensibiloper',
    password : 'test112@',
    database : 'sensibiloper'
            },
  testDbConfig : {
    connectionLimit : 5,
    host : 'localhost',
    user : 'root',
    password : '1234',
    database : 'blog'
  }
};
