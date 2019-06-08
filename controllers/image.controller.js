const path = require('path');
const log4js = require('log4js');
const Docker = require('dockerode');
const jsonfile = require('jsonfile');
const router = require('express').Router();

const templateUtils = require('../utils/template.utils');
const scriptUtils = require('../utils/script.utils');

const docker = new Docker();
const logger = log4js.getLogger('Image');
const filePath = path.join(process.cwd(), 'db/repos.json');
const LOG_LEVEL = process.env.LOG_LEVEL || 'info';

logger.level = LOG_LEVEL;

router.get('/', (req, res) => {
    docker.listImages().then(list => {
        res.status(200).json(list);
    }).catch(err => {
        logger.error(err);
        res.status(500).json({ message: err.message });
    });
});

router.get('/export', (req, res) => {
    try {
        if (!req.query.filename || !req.query.tag) {
            res.status(400).json({ message: 'Bad Request' });
        }
        const image = docker.getImage(req.query.tag);
        if (!image) {
            res.status(400).json({ message: 'Bad Request' });
        } else {
            const filename = req.query.filename + '.tar';
            image.get().then(data => {
                res.setHeader('Content-Disposition', `attachment; filename="${filename}"`)
                data.pipe(res);
            }).catch(err => {
                logger.error(err);
                res.status(500).json({ message: err.message });
            });
        }
    } catch (err) {
        logger.error(err);
        res.status(500).json({ message: err.message });
    }
});

router.delete('/', (req, res) => {
    try {
        if (!req.query.id && !req.query.tag) {
            res.status(400).json({ message: 'Bad Request' });
        }
        let image;
        if (req.query.id) {
            image = docker.getImage(req.query.id);
        }
        if (req.query.tag) {
            image = docker.getImage(req.query.tag);
        }
        if (!image) {
            res.status(400).json({ message: 'Bad Request' });
        } else {
            image.remove({
                force: true
            }).then(data => {
                res.status(200).json(data);
            }).catch(err => {
                logger.error(err);
                res.status(500).json({ message: err.message });
            });
        }
    } catch (err) {
        logger.error(err);
        res.status(500).json({ message: err.message });
    }
});

router.put('/tag', (req, res) => {
    try {
        if (!req.query.id || !req.body || !req.body.tag) {
            res.status(400).json({ message: 'Bad Request' });
        }
        const image = docker.getImage(req.query.id);
        if (!image) {
            res.status(400).json({ message: 'Bad Request' });
        } else {
            image.tag({
                repo: req.body.tag
            }).then(data => {
                res.status(200).json(data);
            }).catch(err => {
                logger.error(err);
                res.status(500).json({ message: err.message });
            });
        }
    } catch (err) {
        logger.error(err);
        res.status(500).json({ message: err.message });
    }
});

router.put('/build', (req, res) => {
    try {
        if (!req.body || !req.body.repo || !req.body.tag || !req.body.branch) {
            res.status(400).json({ message: 'Bad Request' });
        }
        jsonfile.readFile(filePath).then(data => {
            if (!data) {
                data = [];
            }
            const index = data.findIndex(e => e._id == req.body.repo);
            if (index > -1) {
                const temp = data[index];
                temp.branch = req.body.branch;
                temp.tag = req.body.tag;
                const script = templateUtils.buildImageScript(temp);
                scriptUtils.execScript(script).then(status => {
                    logger.info(status);
                }).catch(err => {
                    logger.error(err);
                });
                res.status(200).json({ message: 'Image build process queued' });
            } else {
                res.status(400).json({ message: 'Bad Request' });
            }
        }).catch(err => {
            logger.error(err);
            res.status(500).json({ message: err.message });
        });
    } catch (err) {
        logger.error(err);
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;