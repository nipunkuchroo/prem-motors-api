const getDb = require("../util/database").getDb;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require('../models/user')

exports.register = (req, res, next) => {
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  const email = req.body.email;
  const password = req.body.password;
  const db = getDb();
  let user
  bcrypt
    .hash(password, 12)
    .then((hashpwd) => {
      // return db.execute("call registerUser(?,?,?,?)", [
      //   firstname,
      //   lastname,
      //   email,
      //   hashpwd,
      // ]);
      user = new User(firstname, lastname, email, hashpwd, hashpwd)

      // return {
      //   promise: db.collection('users').findOne({
      //     $or: [{ emailID: user.emailID }]
      //   }), user: user
      // }
      return db.collection('users').findOne({
        $or: [{ emailID: user.emailID }]
      })
    })
    .then((data) => {
      if (data == undefined) {
        return db.collection('users').insertOne(user)
      }
      else {
        const error = new Error("user exists");
        error.statusCode = 400;
        throw error;
      }
    })
    .then((data) => {
      if (data == undefined || data.insertedCount == 0) {
        const error = new Error("user not created");
        error.statusCode = 400;
        throw error;
      } else {
        res.status(200).json({
          message: "user created",
        });
      }
    })
    .catch((error) => {
      console.log(error)
      if (!error.statusCode) {
        error.statusCode = 500;
        error.message = "error occured.";
      }
      res.status(error.statusCode).json({
        message: error.message,
      });
    });
};

exports.login = (req, res, next) => {
  // db.execute("call loginUser(?)", [req.body.username])
  const username = req.body.username
  const password = req.body.password;

  const db = getDb()

  db.collection('users').findOne({
    $or: [{ emailID: username }]
  })
    .then((data) => {
      if (data == undefined || data.emailID != username) {
        const error = new Error("user does not exists");
        error.statusCode = 400;
        throw error;
      } else {
        data.userID = data._id;
        data.bcryptResult = bcrypt.compareSync(
          password,
          data.password
        );
        return data;
      }
    })
    .then((data) => {
      if (data.bcryptResult == true) {
        const tempToken = jwt.sign({ userID: data.userID }, "daswands", {
          expiresIn: "1h",
        });
        res.status(200).json({
          token: tempToken,
          userId: data.userID,
          message: "user logged in",
        });
      } else {
        const error = new Error("incorrect username/password.");
        error.statusCode = 400;
        throw error;
      }
    })
    .catch((error) => {
      if (!error.statusCode) {
        error.statusCode = 500;
        error.message = "error occured";
      }
      res.status(error.statusCode).json({
        message: error.message,
      });
    });
};
