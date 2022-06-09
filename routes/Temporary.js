const express = require('express');
const router = express.Router();

router.get('/', async function (req, res) {
    res.send('Temporary!');
});

module.exports = router;