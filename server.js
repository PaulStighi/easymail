const secretData = require('./sensitiveData.json');

const express = require('express');
const app = express();

app.use(express.static('public'));
app.use(express.json());
app.set('view engine', 'pug');
app.get('/', (req, res) => res.sendFile(__dirname + 'index.html'));

app.use('/sendmail', require('./routes/Sender'));
app.use('/template', require('./routes/Template'));

app.listen(secretData.port, () => console.log(`Server running on port ${secretData.port}`));