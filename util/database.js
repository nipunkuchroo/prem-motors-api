// const dbConnection = require("mysql2");

// const dbPool = dbConnection.createPool({
//   host:'127.0.0.1',
//   user:'root',
//   database:'daswand',
//   password: '#admin2021'
// });

// module.exports = dbPool.promise();
const mongodb = require('mongodb')
const mongoClient = mongodb.MongoClient;

let _db;

const MongoConnect = (callback) => {
  mongoClient.connect('mongodb+srv://admin:admin2021@daswand.tb3rm.mongodb.net/daswand?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true }).then((client) => {
    _db = client.db();
    callback()
  }).catch((error) => {
    console.log(error)
  })
}

const getDb = () => {
  if (_db) {
    return _db;
  }
  throw 'no databse connected'
}

exports.MongoConnect = MongoConnect;
exports.getDb = getDb;