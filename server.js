const secretData = require('./config/sensitiveData.json');
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

app.use('/batch', require('./routes/Batch'));
app.use('/scheduler', require('./routes/Scheduler'));
app.use('/sender', require('./routes/Sender'));
app.use('/templater', require('./routes/Templater'));
app.use('/temporary', require('./routes/Temporary'));
app.use('/verify', require('./routes/Verify'));

app.listen(secretData.port, () => console.log(`Server running on port ${secretData.port}`));