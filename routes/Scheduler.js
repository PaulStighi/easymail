const express = require('express');
const router = express.Router();

router.post('/', async function (req, res) {
    res.send('Scheduler!');
});

module.exports = router;