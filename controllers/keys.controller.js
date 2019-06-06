const fs = require('fs');
const path = require('path');
const log4js = require('log4js');
const multer = require('multer');
const router = require('express').Router();

const logger = log4js.getLogger('Keys');
const dbPath = path.join(process.cwd(), 'keys');

const LOG_LEVEL = process.env.LOG_LEVEL || 'info';

logger.level = LOG_LEVEL;

router.use(multer({
    storage: multer.memoryStorage()
}).single('file'))

router.get('/', (req, res) => {
    try {
        const files = fs.readdirSync(dbPath, 'utf8');
        res.status(200).json(files);
    } catch (err) {
        logger.error(err);
        res.status(500).json({ message: err.message });
    }
});

router.post('/', (req, res) => {
    if (!req.file) {
        res.status(400).json({ message: 'Bad Request' });
        return;
    }
    try {
        fs.writeFileSync(path.join(__dirname, 'keys', req.file.originalname), req.file.buffer);
        res.status(200).json({ message: 'Key saved Successfully' });
    } catch (err) {
        logger.error(err);
        res.status(500).json({ message: err.message });
    }
});

router.delete('/', (req, res) => {
    if (!req.query.id) {
        res.status(400).json({ message: 'Bad Request' });
    }
    try {
        fs.unlinkSync(path.join(dbPath, req.query.id));
        res.status(200).json({ message: 'Key Removed Successfully' });
    } catch (err) {
        logger.error(err);
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;