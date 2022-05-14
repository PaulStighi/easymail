const express = require('express');
const nodemailer = require('nodemailer');
const pug = require('pug');

const app = express();
const port = 3000;

app.set('view engine', 'pug');
app.use(express.static('public'));

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

const transporter = nodemailer.createTransport({
    service: 'outlook',
    auth: {
        user: 'paul.stiegelbauer@student.upt.ro',
        pass: 'Palind1627'
    }
});

const compiledFunction = pug.compileFile('template.pug');

const details = {
    from: 'paul.stiegelbauer@student.upt.ro',
    to: 'baubau@mailinator.com',
    subject: 'Sending Email using Node.js',
    html: compiledFunction({
        title: 'Titlu',
        message: 'Un header',
        name: 'Paul',
        youAreUsingPug: true
    })
};


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