const express = require('express');
const router = express.Router();
const _ = require('lodash');
const secretData = require('./../config/sensitiveData.json');
const Verifier = require('email-verifier');
const verifier = new Verifier(secretData.emailVerificationAPIKey, { validateDNS: true, validateSMTP: true });

router.get('/', async function (req, res) {
    res.send('Verify!');
});

router.get('/email', async function (req, res) {
    console.log('[' + new Date().toUTCString() + '] Email address in validation...');

    const email = _.get(req.body, 'email');

    verifier.verify(email, (error, data) => {
        if (error) {
            console.log(error);
            res.status(400).json({ 'success': false, 'message': 'Error in verifing email' });
        }

        const formatCheck = _.isEqual(_.get(data, 'formatCheck'), 'true');
        const dnsCheck = _.isEqual(_.get(data, 'dnsCheck'), 'true');
        const smtpCheck = _.isEqual(_.get(data, 'smtpCheck'), 'true');

        if (formatCheck && dnsCheck && smtpCheck) {
            res.status(200).json({ 'success': true, 'message': 'Address is valid' });
        }
        else {
            res.status(200).json({ 'success': false, 'message': 'Address is not valid' });
        }
    });
});

module.exports = router;