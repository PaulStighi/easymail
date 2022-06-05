const express = require('express');
const router = express.Router();
const importFile = require('../scripts/importFile');
const _ = require('lodash');
const Batchlist = require('../models/Batchlist');

router.post('/', async function (req, res) {
    res.send('Batch!');
});

// Create
router.post('/save', async function (req, res) {
    console.log('[' + new Date().toUTCString() + '] Batchlist in saving...');

    const B_content = importFile.importFile(req.query.path);

    const addr = _.split(B_content, "\r\n");

    const batchlist = new Batchlist(Object.assign(
        { 'to': addr }
    ));

    try {
        const doc = await batchlist.save();
        res.status(200).json({ 'success': true, 'message': 'Batchlist details saved', result: doc });
    } catch (err) {
        res.status(400).json({ 'success': false, 'message': 'Error in saving Template details: ' + err });
    }

});

// Read
router.get('/findById', async function (req, res) {
    console.log('[' + new Date().toUTCString() + '] Batchlist in finding...');

    const batchlist = await Batchlist.findById(req.body.id).exec();
    res.status(200).json(batchlist);
});

// Delete

module.exports = router;