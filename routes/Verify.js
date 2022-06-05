const express = require('express');
const router = express.Router();
const secretData = require('./../config/sensitiveData.json');
const _ = require('lodash');
const emailValidator = require('deep-email-validator');

router.post('/', async function (req, res) {
    res.send('Verify!');
});

router.get('/email', async function(req, res) {
    console.log('[' + new Date().toUTCString() + '] Email address in validation...');

    const email = _.get(req.body, 'email');
    const {valid, reason, validators} = await emailValidator.validate(email);

    if(valid) {
        res.status(200).json({ 'success': true, 'message': 'Address is valid' });
    }
    else {
        res.status(200).json({ 'success': false, 'message': 'Address is not valid, reason: ' + validators[reason].reason });
    }
});

module.exports = router;