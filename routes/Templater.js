const express = require('express');
const router = express.Router();
const secretData = require('../sensitiveData.json');
const pug = require('pug');

const compiledFunction = pug.compileFile('template.pug');

const details = Object.assign(
    secretData.details,
    { 'html': compiledFunction(secretData.locals) }
);

router.post('/', async function(req, res) {
    res.send('Templater!');
});

module.exports = router;
module.exports.details = details;