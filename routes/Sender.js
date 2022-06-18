const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const secretData = require('./../config/sensitiveData.json');
const _ = require('lodash');
const Task = require('../models/Task');
const Batchlist = require('../models/Batchlist');
const compileTemplate = require('../scripts/compileTemplate');
const transporter = nodemailer.createTransport(secretData.transport);

router.get('/', async function (req, res) {
    res.send('Sender!');
});

router.post('/executeTask', async function (req, res) {
    console.log('[' + new Date().toLocaleString() + '] Task in execution...');

    try {
        const task = await Task.findById(req.body.taskId).exec();
        const batchlist = _.get(await Batchlist.findById(_.get(task, 'batchId')).exec(), 'to');

        _.forEach(batchlist, (target) => {
            return compileTemplate.compileTemplate(task, target)
                .then((details) => {
                    transporter.sendMail(details, (error, info) => {
                        if (error) {
                            console.log(error);
                            res.status(400).json({ 'success': false, 'message': ('Error in sending Email: ' + target + ' : ' + error) });
                        } else {
                            console.log('[' + new Date().toLocaleString() + '] Email sent: ' + info.response + ' to ' + target);
                        }
                    });
                })
                .catch((err) => res.status(400).json({ 'success': false, 'message': ('Error in compiling Template details: ' + err) }));
        });

        res.status(200).json({ 'success': true, 'message': 'Emails queued!' });
    } catch (err) {
        res.status(400).json({ 'success': false, 'message': ('Error in sending Emails: ' + err) })
    }
});

module.exports = router;