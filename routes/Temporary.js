const express = require('express');
const router = express.Router();

router.post('/', async function (req, res) {
    res.send('Temporary!');
});

module.exports = router;