var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mariadb = require('mariadb');
const config = require('./conf.json');
var express = require("express"),
    bodyParser = require("body-parser"),
    swaggerJsdoc = require("swagger-jsdoc"),
    swaggerUi = require("swagger-ui-express");

var recherchesRouter = require('./routes/recherches');
var recherchesRouterTest = require('./routes/recherchesTest');
var annuaireRouterTest = require('./routes/annuaire');
var statistiquesRouterTest = require('./routes/statistiques');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use("/meta", express.static(path.join(__dirname, 'dist')));

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Documentation Metamoteur",
            version: "0.1.0",
            description:
                "Moteur de recherche ultra puissant !!",
            /*license: {
                name: "MIT",
                url: "https://spdx.org/licenses/MIT.html",
            },
            contact: {
                name: "LogRocket",
                url: "https://logrocket.com",
                email: "info@email.com",
            },*/
        },
        servers: [
            {
                url: "http://localhost:80/",
            },
        ],
    },
    apis: [
        "./routes/recherches.js"
    ],
};

const specs = swaggerJsdoc(options);
app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(specs, { explorer: true })
);


const pool = mariadb.createPool({
  host: config.mariadb.host,
  user: config.mariadb.user,
  password: config.mariadb.password,
  connectionLimit: config.mariadb.connectionLimit,
  database: config.mariadb.db,
});
const checkConnection = require('./lib/checkConnection');
checkConnection(pool);

app.use(function(req, res, next) {
  req.pool = pool;
  next();
});

app.use('/', recherchesRouter);
app.use('/', recherchesRouterTest);
app.use('/', annuaireRouterTest);
app.use('/', statistiquesRouterTest);
// app.use('/', getIndex);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
