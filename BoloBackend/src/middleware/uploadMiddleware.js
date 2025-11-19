const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

// store file locally first in uploads/, then controller will push to Cloudinary
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${uuidv4()}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  // allow common audio types + images if needed
  const allowedMime = ['audio/mpeg', 'audio/wav', 'audio/x-wav', 'audio/mp3', 'audio/x-m4a', 'image/jpeg', 'image/png'];
  if (allowedMime.includes(file.mimetype)) cb(null, true);
  else cb(new Error('Unsupported file type'), false);
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 50 * 1024 * 1024 } }); // 50MB

module.exports = upload;
