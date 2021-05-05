const express = require("express");
const bodyParser = require("body-parser");
const mongoConnect = require('./util/database').MongoConnect;

const accountRoute = require("./routes/account");
const dashboardRoute = require("./routes/dashboard");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json({ extended: true }));

app.use((req, res, next) => {
  res.setHeader("access-control-allow-origin", "*");
  res.setHeader("access-control-allow-methods", "get,post,put,patch,delete");
  res.setHeader(
    "access-control-allow-headers",
    "content-type,authorization,token"
  );
  next();
});

app.use(accountRoute.router);
app.use(dashboardRoute.router);

mongoConnect(() => {
  app.listen(8080);

})
