const multer = require('multer');
const { nanoid } = require('nanoid');
const path = require('path');
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, './public/uploads');
    },
    filename: (req, file, callback) => {
        callback(null, nanoid(10) + path.extname(file.originalname));
    }
});
const upload = (req, res, next) => {
    multer({
        storage: storage,
        limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10 MB
    }).single('file')(req, res, (err) => {
        if (err) {
            return res.status(400).send({ error: err.message });
        }
        next();
    });
};

module.exports = { upload };