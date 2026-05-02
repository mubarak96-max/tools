const fs = require('fs');
const path = require('path');

const oldPath = path.join('src', 'app', 'utility', 'qr-code-generator');
const newPath = path.join('src', 'app', 'utility', 'create-qr-code-online');

try {
    if (fs.existsSync(oldPath)) {
        fs.renameSync(oldPath, newPath);
        console.log(`Successfully renamed ${oldPath} to ${newPath}`);
    } else {
        console.log(`${oldPath} does not exist`);
    }
} catch (err) {
    console.error(`Error renaming directory: ${err.message}`);
}
