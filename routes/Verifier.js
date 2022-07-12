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

    try {
        const result = await verifyEmail.verifyEmail(req.query.email);
        
        if (_.isNull(result)) {
            res.status(400).json({ 'success': false, 'message': 'Error in verifing email' });
        }
        else {
            if (result) {
                res.status(200).json({ 'success': true, 'message': 'Address is valid' });
            }
            else {
                res.status(200).json({ 'success': false, 'message': 'Address is not valid' });
            }
        }
    } catch (err) {
        res.status(400).json({ 'success': false, 'message': 'Error in verifing email: ' + err });
    }
});

router.get('/batch', async function (req, res) {
    console.log('[' + new Date().toLocaleString() + '] Batch email address in validation...');

    try {
        const batchlist = _.get(await Batchlist.findById(req.query.batchId).exec(), 'to');
        let results = [];
    
        for (const email of batchlist) {
            const result = await verifyEmail.verifyEmail(email);
            console.log('[' + new Date().toLocaleString() + '] Email ' + email + ' in validation...');
    
            if (_.isNull(result)) {
                results.push(
                    {
                        'address': email,
                        'valid': 'inconclusive'
                    }
                );
            }
            else {
                if (result) {
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
            }
        };

        if (!_.isEmpty(results)) {
            res.status(200).json({ 'success': true, 'message': 'Batch verified and purified', result: results });
        }
        else {
            res.status(400).json({ 'success': false, 'message': 'Error in verifing batchlist'});
        }
    
    } catch (err) {
        res.status(400).json({ 'success': false, 'message': 'Error in verifing batchlist: ' + err });
    }

});

module.exports = router;