const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const secretData = require('./../sensitiveData.json');

const transporter = nodemailer.createTransport(secretData.transport);

router.post('/sendmail', async function(req, res) {
    transporter.sendMail(details, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });

    res.send('Email sent!');
});