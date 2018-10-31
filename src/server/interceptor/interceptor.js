var express = require('express');
var router = express.Router();
var token = require('../user/token');
var wxconfig = require('../wxconfig');
var session = require('express-session');
var cookieParser = require('cookie-parser');

module.exports = router;