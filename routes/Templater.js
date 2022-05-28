const express = require('express');
const router = express.Router();
const secretData = require('../config/sensitiveData.json');
const pug = require('pug');
const _ = require('lodash');
const mongoose = require('mongoose');
const Template = require('../models/Template');
const fs = require('fs');

function inlineTemplate(path) {
    const data = fs.readFileSync(path, 'utf8', (err) => {
        if(err) {
            console.log(err);
            return;
        }
    });

    return data;
}

async function compileTemplate(templateId) {
    return Template.findById(templateId).exec().then((template) => {
        const T_content = _.pick(template, 'content');
        const T_details = _.pick(template, 'details');
        const T_locals = _.pick(template, 'locals');
        
        const compiledFunction = pug.compile(T_content.content);

        const details = Object.assign(
            T_details.details,
            { 'html': compiledFunction(T_locals.locals) }
        );

        return details;
    });
}

router.post('/', async function (req, res) {
    res.send('Templater!');
});

router.post('/save', async function (req, res) {
    const T_content = inlineTemplate(req.query.path);

    req.body = Object.assign(
        { 'content': T_content },
        _.pick(req.body, 'details'),
        _.pick(req.body, 'locals'),
    );

    console.log(req.body);

    const template = new Template(req.body);

    try {
        await template.save();
        res.status(200).json({ 'success': true, 'message': 'Template details saved' });
    } catch (err) {
        res.status(400).json({ 'success': false, 'message': 'Error in saving Template details' });
    }

});

router.get('/findById', async function (req, res) {
    const template = await Template.find(req.body.id).exec();
    res.status(200).json(template);
});

module.exports = router;
module.exports.compileTemplate = compileTemplate;
module.exports.inlineTemplate = inlineTemplate;