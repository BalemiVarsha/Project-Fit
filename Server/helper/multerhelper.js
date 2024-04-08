const multer = require('multer');

function setupMulter() {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/'); // Dest folder for storing uploads
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname); 
    }
  });

  const upload = multer({ storage: storage });

  return upload;
}

module.exports = setupMulter;
