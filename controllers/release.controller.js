const path = require('path');
const log4js = require('log4js');
const jsonfile = require('jsonfile');
const router = require('express').Router();

const templateUtils = require('../utils/template.utils');
const scriptUtils = require('../utils/script.utils');

const logger = log4js.getLogger('Release');
const filePath = path.join(process.cwd(), 'db/release.json');
const LOG_LEVEL = process.env.LOG_LEVEL || 'info';

logger.level = LOG_LEVEL;

router.get('/', (req, res) => {
    try {
        jsonfile.readFile(filePath).then(data => {
            res.status(200).json(data);
        }).catch(err => {
            logger.error(err);
            res.status(500).json({ message: err.message });
        });
    } catch (err) {
        logger.error(err);
        res.status(500).json({ message: err.message });
    }
});

router.post('/', (req, res) => {
    if (!req.body || !req.body.url || !req.body.name) {
        res.status(400).json({ message: 'Bad Request' });
    }
    jsonfile.readFile(filePath).then(data => {
        if (!data) {
            data = [];
        }
        const body = req.body;
        data.push(body);
        jsonfile.writeFile(filePath, data).then(saved => {
            res.status(200).json(body);
        }).catch(err => {
            logger.error(err);
            res.status(500).json({ message: err.message });
        });
    }).catch(err => {
        logger.error(err);
        res.status(500).json({ message: err.message });
    });
});

router.put('/', (req, res) => {
    if (!req.query.release || !req.body || !req.body.repos || req.body.repos.length == 0) {
        res.status(400).json({ message: 'Bad Request' });
        return;
    }
    jsonfile.readFile(filePath).then(data => {
        if (!data) {
            data = [];
        }
        const index = data.findIndex(e => e.release == req.query.release);
        if (index > -1) {
            const temp = data[index];
            req.body.release = temp.release;
            data.splice(index, 1, req.body);
            jsonfile.writeFile(filePath, data).then(saved => {
                res.status(200).json(req.body);
            }).catch(err => {
                logger.error(err);
                res.status(500).json({ message: err.message });
            });
        } else {
            res.status(400).json({ message: 'Bad Request' });
        }
    }).catch(err => {
        logger.error(err);
        res.status(500).json({ message: err.message });
    });
});

router.delete('/', (req, res) => {
    if (!req.query.release) {
        res.status(400).json({ message: 'Bad Request' });
    }
    jsonfile.readFile(filePath).then(data => {
        if (!data) {
            data = [];
        }
        const index = data.findIndex(e => e.release == req.query.release);
        if (index > -1) {
            const temp = data[index];
            data.splice(index, 1);
            jsonfile.writeFile(filePath, data).then(saved => {
                res.status(200).json({ message: temp.release + ' deleted successfully' });
            }).catch(err => {
                logger.error(err);
                res.status(500).json({ message: err.message });
            });
        } else {
            res.status(400).json({ message: 'Bad Request' });
        }
    }).catch(err => {
        logger.error(err);
        res.status(500).json({ message: err.message });
    });
});

router.put('/trigger', (req, res) => {
    if (!req.query.release) {
        res.status(400).json({ message: 'Bad Request' });
        return;
    }
    jsonfile.readFile(filePath).then(data => {
        if (!data) {
            data = [];
        }
        const index = data.findIndex(e => e.release == req.query.release);
        if (index > -1) {
            const temp = data[index];
            const script = templateUtils.releaseScript(temp);
            scriptUtils.execScript(script).then(status => {
                logger.info(status);
            }).catch(err => {
                logger.error(err);
            });
            res.status(200).json({ message: temp.release + ' release is triggered' });
        } else {
            res.status(400).json({ message: 'Bad Request' });
        }
    }).catch(err => {
        logger.error(err);
        res.status(500).json({ message: err.message });
    });
});

module.exports = router;