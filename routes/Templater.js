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

    try {
        const T_content = importFile.importFile(req.body.path);
        
        if(T_content) {
            const template = new Template(Object.assign(
                { 'content': T_content }
            ));
        
            try {
                const doc = await template.save();
                res.status(200).json({ 'success': true, 'message': 'Template details saved', result: doc });
            } catch (err) {
                res.status(400).json({ 'success': false, 'message': 'Error in saving Template details: ' + err });
            }
        }
        else {
            res.status(404).json({ 'success': false, 'message': 'Error in saving Template details: file not found'});
        }
    } catch (err) {
        res.status(400).json({ 'success': false, 'message': 'Error in saving Template details: ' + err });
    }
    


});

// Read one
router.get('/findById', async function (req, res) {
    console.log('[' + new Date().toLocaleString() + '] Template in finding...');

    try {
        const template = await Template.findById(req.query.templateId).exec();

        res.status(200).json(template);
    } catch (err) {
        res.status(400).json({ 'success': false, 'message': 'Error in finding Template details: ' + err });
    }
});

// Read all
router.get('/read', async function (req, res) {
    console.log('[' + new Date().toLocaleString() + '] Template in finding all with condition...');

    try { 
        const templates = await Template.find(req.query.condition ? JSON.parse(req.query.condition) : {}).exec();
    
        res.status(200).json(templates);
    } catch (err) {
        res.status(400).json({ 'success': false, 'message': 'Error in finding all with condition Template details: ' + err });

    }
});

// Delete one
router.post('/deleteById', async function (req, res) {
    console.log('[' + new Date().toLocaleString() + '] Template in deleting...');

    Template.findOneAndDelete({ '_id': req.body.templateId })
        .then((doc) => {
            if (!doc) {
                res.status(400).json({ 'success': false, 'message': 'No template matching the id: ' + req.body.templateId });
            }
            else {
                res.status(200).json({ doc, 'message': 'Template deleted successfully!' });
            }
        })
        .catch((err) => {
            res.status(500).send({ 'message': 'Error in deleting Template details: ' + err });
        })
});

module.exports = router;