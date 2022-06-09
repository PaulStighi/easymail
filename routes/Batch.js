const express = require('express');
const router = express.Router();
const importFile = require('../scripts/importFile');
const _ = require('lodash');
const Batchlist = require('../models/Batchlist');

router.get('/', async function (req, res) {
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
        res.status(400).json({ 'success': false, 'message': 'Error in saving Batchlist details: ' + err });
    }

});

// Read one
router.get('/findById', async function (req, res) {
    console.log('[' + new Date().toUTCString() + '] Batchlist in finding...');

    const batchlist = await Batchlist.findById(req.body.id).exec();
    res.status(200).json(batchlist);
});

// Read all
router.get('/read', async function (req, res) {
    console.log('[' + new Date().toUTCString() + '] Batchlist in finding all with condition...');

    const batchlists = await Batchlist.find(req.body.condition ? JSON.parse(req.body.condition) : {}).exec();

    res.status(200).json(batchlists);
});

// Delete one
router.delete('/deleteById', async function (req, res) {
    console.log('[' + new Date().toUTCString() + '] Batchlist in deleting...');

    Batchlist.findOneAndDelete({ '_id': req.body.id })
        .then((doc) => {
            if (!doc) {
                res.status(400).json({ 'success': false, 'message': 'No batchlist matching the id: ' + req.body.id });
            }
            else {
                res.status(200).json({ doc, 'message': 'Batchlist deleted successfully!' });
            }
        })
        .catch((err) => {
            res.status(500).send({ 'message': 'Error in saving Batchlist details: ' + err });
        })
});

module.exports = router;