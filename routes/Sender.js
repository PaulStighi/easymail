const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const secretData = require('./../config/sensitiveData.json');
const template = require('./Templater');
const Task = require('../models/Task');
const _ = require('lodash');

const transporter = nodemailer.createTransport(secretData.transport);

router.post('/sendByTemplateId', async function (req, res) {
    await template.compileTemplate(req.body.templateId)
        .then((details) => {
            transporter.sendMail(details, (error, info) => {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });
        });

    res.send('End send!');
});

router.post('/saveTask', async function (req, res) {
    const task = new Task(Object.assign(
        { scheduledFor: req.body.scheduledFor },
        { templateId: req.body.templateId },
        { batchlistId: req.body.batchlistId },
        _.get(req.body, 'details'),
        _.get(req.body, 'locals'),
    ));

    try {
        task.save();
        res.status(200).json({ 'success': true, 'message': 'Task details saved' });
    } catch (err) {
        res.status(400).json({ 'success': false, 'message': 'Error in saving Task details: ' + err });
    }
});

router.post('/executeTask', async function (req, res) {

});

module.exports = router;