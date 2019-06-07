const path = require('path');
const log4js = require('log4js');
const jsonfile = require('jsonfile');
const router = require('express').Router();

const logger = log4js.getLogger('Config');
const filePath = path.join(process.cwd(), 'db/config.json');
const LOG_LEVEL = process.env.LOG_LEVEL || 'info';

logger.level = LOG_LEVEL;

router.get('/accessToken', (req, res) => {
    jsonfile.readFile(filePath).then(data => {
        if (data && data.access) {
            res.status(200).json(data.access);
        } else {
            res.status(200).json({});
        }
    }).catch(err => {
        logger.error(err);
        res.status(500).json({ message: err.message });
    });
});

router.post('/accessToken', (req, res) => {
    jsonfile.readFile(filePath).then(data => {
        if (!req.body || !req.body.username || !req.body.accessToken) {
            res.status(400).json({ message: 'Bad Request' });
            return;
        }
        if (!data) {
            data = {};
        }
        data.access = req.body;
        jsonfile.writeFile(filePath, data).then(status => {
            res.status(200).json({ message: 'Access Token Saved' });
        }).catch(err => {
            logger.error(err);
            res.status(500).json({ message: err.message });
        });
    }).catch(err => {
        logger.error(err);
        res.status(500).json({ message: err.message });
    });
});

module.exports = router;