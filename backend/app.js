var express = require('express');
var logger = require('morgan');
require('dotenv').config()
const helmet = require('helmet');
const cors = require('cors');

// importing the router
var apiRouterV1 = require('./routes/v1/api');

var app = express();

const corsOptions = {
    //multiple origins
    origin: "http://localhost:5173",
    methods: ['POST', 'PUT', 'GET', 'OPTIONS', 'HEAD', 'DELETE', 'PATCH'],
    optionsSuccessStatus: 200,
}
app.use(cors(corsOptions))
app.use(express.json({limit: '100mb'}));
app.use(express.urlencoded({limit: '100mb'}));
app.use(helmet()); // Helmet helps you secure your Express apps by setting various HTTP headers.
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(mongoSanitize()); // Data sanitization against NoSQL query injection

//calling the routers
app.use('/api/v1', apiRouterV1);

app.all('*', (req, res, next) => {
      res.status(404).json({'Error':`Cant Find ${req.originalUrl}`}); // 404 Not Found
});

module.exports = app;