const express = require('express');
const router = express.Router();
const pug = require('pug');
const secretData = require('./../sensitiveData.json');

const compiledFunction = pug.compileFile('template.pug');

const details = Object.assign(
    secretData.details,
    { 'html': compiledFunction(secretData.locals) }
);

module.exports.details = details