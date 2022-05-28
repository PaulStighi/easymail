const mongoose = require('mongoose');

const batchlistSchema = new mongoose.Schema({
    to: [
        { type: mongoose.Schema.Types.String }
    ],
}, { collection: 'batchlists' });

module.exports = mongoose.model('Batchlist', batchlistSchema);