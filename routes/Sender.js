const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const secretData = require('./../sensitiveData.json');
const template = require('./Template');

const transporter = nodemailer.createTransport(secretData.transport);

router.post('/', async function(req, res) {
    transporter.sendMail(template.details, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });

    res.send('End send!');
});

module.exports = router;