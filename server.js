import * as secretData from './sensitiveData.json';
const express = require('express');
const nodemailer = require('nodemailer');
const pug = require('pug');

const app = express();

app.set('view engine', 'pug');
app.use(express.static('public'));

app.listen(port, () => {
    console.log(`Server running on port ${secretData.port}`);
});

const transporter = nodemailer.createTransport(secretData.transport);

const compiledFunction = pug.compileFile('template.pug');

const details = Object.assign(secretData.details, compiledFunction(secretData.locals));

app.get('/', (req, res) => {
    res.sendFile(__dirname + 'index.html');
});

app.post('/sendmail', (req, res) => {
    transporter.sendMail(details, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });

    res.send('Email sent!');
});