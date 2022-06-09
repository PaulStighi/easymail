const express = require('express');
const router = express.Router();
const Template = require('../models/Template');
const importFile = require('../scripts/importFile');

router.get('/', async function (req, res) {
    res.send('Templater!');
});

// Create
router.post('/save', async function (req, res) {
    console.log('[' + new Date().toLocaleString() + '] Template in saving...');

    const T_content = importFile.importFile(req.query.path);

    req.body = Object.assign(
        { 'content': T_content }
    );

    const template = new Template(req.body);

    try {
        const doc = await template.save();
        res.status(200).json({ 'success': true, 'message': 'Template details saved', result: doc });
    } catch (err) {
        res.status(400).json({ 'success': false, 'message': 'Error in saving Template details: ' + err });
    }

});

// Read one
router.get('/findById', async function (req, res) {
    console.log('[' + new Date().toLocaleString() + '] Template in finding...');

    const template = await Template.findById(req.body.id).exec();
    res.status(200).json(template);
});

// Read all
router.get('/read', async function (req, res) {
    console.log('[' + new Date().toLocaleString() + '] Template in finding all with condition...');

    const templates = await Template.find(req.body.condition ? JSON.parse(req.body.condition) : {}).exec();

    res.status(200).json(templates);
});

// Delete one
router.delete('/deleteById', async function (req, res) {
    console.log('[' + new Date().toLocaleString() + '] Template in deleting...');

    Template.findOneAndDelete({ '_id': req.body.id })
        .then((doc) => {
            if (!doc) {
                res.status(400).json({ 'success': false, 'message': 'No template matching the id: ' + req.body.id });
            }
            else {
                res.status(200).json({ doc, 'message': 'Template deleted successfully!' });
            }
        })
        .catch((err) => {
            res.status(500).send({ 'message': 'Error in saving Template details: ' + err });
        })
});

module.exports = router;