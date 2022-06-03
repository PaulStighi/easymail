const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const secretData = require('./../config/sensitiveData.json');
const template = require('./Templater');
const _ = require('lodash');
const Task = require('../models/Task');

const transporter = nodemailer.createTransport(secretData.transport);

// router.post('/sendByTemplateId', async function (req, res) {
//     await template.compileTemplate(req.body.templateId)
//         .then((details) => {
//             transporter.sendMail(details, (error, info) => {
//                 if (error) {
//                     console.log(error);
//                 } else {
//                     console.log('Email sent: ' + info.response);
//                 }
//             });
//         });

//     res.send('End send!');
// });

router.post('/saveTask', async function (req, res) {
    const task = new Task(Object.assign(
        // { 'scheduledFor': req.body.scheduledFor },
        { 'templateId': req.body.templateId },
        { 'batchlistId': req.body.batchlistId },
        { 'details': _.get(req.body, 'details') },
        { 'locals': _.get(req.body, 'locals') },
    ));

    try {
        await task.save();
        res.status(200).json({ 'success': true, 'message': 'Task details saved' });
    } catch (err) {
        res.status(400).json({ 'success': false, 'message': 'Error in saving Task details: ' + err });
    }
});

router.post('/executeTask', async function (req, res) {
    const task = await Task.findById(req.body.id).exec();

    await template.compileTemplate(task)
        .then((details) => {
            transporter.sendMail(details, (error, info) => {
                if (error) {
                    console.log(error);
                    res.status(400).json({ 'success': false, 'message': ('Error in saving Template details: ' + error) });
                } else {
                    console.log('Email sent: ' + info.response);
                    res.status(200).json({ 'success': true, 'message': ('Email sent: ' + info.response) });
                }
            });
        });
});

module.exports = router;