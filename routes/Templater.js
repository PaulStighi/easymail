const express = require('express');
const router = express.Router();
const _ = require('lodash');
const Template = require('../models/Template');
const importFile = require('../scripts/importFile');

router.post('/', async function (req, res) {
    res.send('Templater!');
});

router.post('/save', async function (req, res) {
    const T_content = importFile.importFile(req.query.path);

    req.body = Object.assign(
        { 'content': T_content }
    );

    const template = new Template(req.body);

    try {
        await template.save();
        res.status(200).json({ 'success': true, 'message': 'Template details saved' });
    } catch (err) {
        res.status(400).json({ 'success': false, 'message': 'Error in saving Template details: ' + err });
    }

});

router.get('/findById', async function (req, res) {
    const template = await Template.findById(req.body.id).exec();
    res.status(200).json(template);
});

module.exports = router;