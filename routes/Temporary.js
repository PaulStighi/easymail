const express = require('express');
const router = express.Router();
const secretData = require('./../sensitiveData.json');

router.post('/', async function(req, res) {
    res.send('Temporary!');
});

module.exports = router;