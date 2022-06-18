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
    console.log('[' + new Date().toLocaleString() + '] Batchlist in saving...');

    try {
        const B_content = importFile.importFile(req.body.path);
    
        if(B_content) {
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
        }
        else {
            res.status(400).json({ 'success': false, 'message': 'Error in saving Batchlist details: file not found'});
        }
    } catch (err) {
        res.status(400).json({ 'success': false, 'message': 'Error in saving Batchlist details: ' + err });
    }
});

// Read one
router.get('/findById', async function (req, res) {
    console.log('[' + new Date().toLocaleString() + '] Batchlist in finding...');

    try {
        const batchlist = await Batchlist.findById(req.query.batchId).exec();
        
        res.status(200).json(batchlist);
    } catch (err) {
        res.status(400).json({ 'success': false, 'message': 'Error in finding Batchlist details: ' + err });
    }
});

// Read all
router.get('/read', async function (req, res) {
    console.log('[' + new Date().toLocaleString() + '] Batchlist in finding all with condition...');

    try {
        const batchlists = await Batchlist.find(req.query.condition ? JSON.parse(req.query.condition) : {}).exec();
    
        res.status(200).json(batchlists);
    } catch (err) {
        res.status(400).json({ 'success': false, 'message': 'Error in finding all with condition Batchlist details: ' + err });
    }
});

// Delete one
router.post('/deleteById', async function (req, res) {
    console.log('[' + new Date().toLocaleString() + '] Batchlist in deleting...');

    Batchlist.findOneAndDelete({ '_id': req.body.batchId })
        .then((doc) => {
            if (!doc) {
                res.status(400).json({ 'success': false, 'message': 'No batchlist matching the id: ' + req.body.batchId });
            }
            else {
                res.status(200).json({ doc, 'message': 'Batchlist deleted successfully!' });
            }
        })
        .catch((err) => {
            res.status(500).send({ 'message': 'Error in deleting Batchlist details: ' + err });
        })
});

module.exports = router;