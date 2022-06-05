const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const secretData = require('./../config/sensitiveData.json');
const _ = require('lodash');
const Task = require('../models/Task');
const Batchlist = require('../models/Batchlist');
const compileTemplate = require('../scripts/compileTemplate');
const transporter = nodemailer.createTransport(secretData.transport);

router.post('/', async function (req, res) {
    res.send('Sender!');
});

// Create
router.post('/saveTask', async function (req, res) {
    console.log('[' + new Date().toUTCString() + '] Task in saving...');

    const task = new Task(Object.assign(
        // { 'scheduledFor': req.body.scheduledFor },
        { 'templateId': req.body.templateId },
        { 'batchlistId': req.body.batchlistId },
        { 'details': _.get(req.body, 'details') },
        { 'locals': _.get(req.body, 'locals') },
    ));

    try {
        const doc = await task.save();
        res.status(200).json({ 'success': true, 'message': 'Task details saved', result: doc });
    } catch (err) {
        res.status(400).json({ 'success': false, 'message': 'Error in saving Task details: ' + err });
    }
});

// Read
router.get('/findById', async function (req, res) {
    console.log('[' + new Date().toUTCString() + '] Task in finding...');

    const task = await Task.findById(req.body.id).exec();
    res.status(200).json(task);
});

router.post('/executeTask', async function (req, res) {
    console.log('[' + new Date().toUTCString() + '] Task in execution...');

    const task = await Task.findById(req.body.id).exec();
    const batchlist = _.get(await Batchlist.findById(_.get(task, 'batchlistId')).exec(), 'to');

    _.forEach(batchlist, (target) => {
        return compileTemplate.compileTemplate(task, target)
            .then((details) => {
                transporter.sendMail(details, (error, info) => {
                    if (error) {
                        console.log(error);
                        res.status(400).json({ 'success': false, 'message': ('Error in saving Template details: ' + error) });
                    } else {
                        console.log('[' + new Date().toUTCString() + '] Email sent: ' + info.response + ' to ' + target);
                    }
                });
            });
    });

    res.status(200).json({ 'success': true, 'message': 'Emails sent!' });
});

module.exports = router;