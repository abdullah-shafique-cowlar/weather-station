var express = require('express');
var router = express.Router();
const user_controller = require('../../controllers/v1/user.controller')

router.get('/', function (req, res, next) {
    res.send({"data":'Api Router called'});
});

router.post('/users', user_controller.create)

module.exports = router