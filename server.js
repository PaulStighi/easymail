const secretData = require('./config/sensitiveData.json');
const express = require('express');
const mongoose = require('mongoose');
const app = express();
app.use(express.static('public'));

// DB Connection

mongoose.connect(secretData.db_url,
    { useNewUrlParser: true },
    function () {
        console.log('connected to database\n');
    }
);

// App init

app.use(express.json());
app.set('view engine', 'pug');
app.set('json spaces', 2);
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.sendFile(__dirname + 'index.html');
});

app.use('/batcher', require('./routes/Batcher'));
app.use('/sender', require('./routes/Sender'));
app.use('/tasker', require('./routes/Tasker'));
app.use('/templater', require('./routes/Templater'));
app.use('/verifier', require('./routes/Verifier'));

app.listen(secretData.port, () => console.log(`Server running on port ${secretData.port}`));