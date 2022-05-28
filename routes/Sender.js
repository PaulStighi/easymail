const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const secretData = require('./../config/sensitiveData.json');
const template = require('./Templater');

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

module.exports = router;