const multer = require('multer');

// Store file in memory, not in local folder
const storage = multer.memoryStorage();
const upload = multer({ storage });

module.exports = upload;
