const express = require('express');
const router = express.Router();
const _ = require('lodash');
const Batchlist = require('../models/Batchlist');
const verifyEmail = require('../scripts/verifyEmail');

router.get('/', async function (req, res) {
    res.send('Verify!');
});

router.get('/email', async function (req, res) {
    console.log('[' + new Date().toLocaleString() + '] Email address in validation...');

    if (await verifyEmail.verifyEmail(req.query.email)) {
        res.status(200).json({ 'success': true, 'message': 'Address is valid' });
    }
    else {
        res.status(200).json({ 'success': false, 'message': 'Address is not valid' });
    }
});

router.get('/batch', async function (req, res) {
    console.log('[' + new Date().toLocaleString() + '] Batch email address in validation...');

    const batchlist = _.get(await Batchlist.findById(req.query.batchId).exec(), 'to');
    let results = [];

    for (const email of batchlist) {
        if (await verifyEmail.verifyEmail(email)) {
            results.push(
                {
                    'address': email,
                    'valid': true
                }
            );
        }
        else {
            results.push(
                {
                    'address': email,
                    'valid': false
                }
            );

            await Batchlist.findByIdAndUpdate(req.query.batchId, { $pull: { 'to': email } });
        }
    };

    res.status(200).json({ 'success': true, 'message': 'Batch verified and purified', result: results });

});

module.exports = router;