const fs = require('fs');

function importFile(path) {
    const data = fs.readFileSync(path, 'utf8', (err) => {
        if (err) {
            console.log(err);
            return null;
        }
    });

    return data;
}

module.exports.importFile = importFile;