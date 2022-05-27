const secretData = require('./sensitiveData.json');
const express = require('express');
const mongoose = require('mongoose');
const app = express();
app.use(express.static('public'));

// DB Connection

const db_url = 'mongodb://localhost:27017/mail-pug-inator';

mongoose.connect(db_url,
    { useNewUrlParser: true },
    function () {
        console.log('connected to database');
    }
);

// App init

app.use(express.json());
app.set('view engine', 'pug');

app.get('/', (req, res) => {
    res.sendFile(__dirname + 'index.html');
});

app.use('/sendmail', require('./routes/Sender'));

app.listen(secretData.port, () => console.log(`Server running on port ${secretData.port}`));