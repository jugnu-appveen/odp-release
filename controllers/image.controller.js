const log4js = require('log4js');
const Docker = require('dockerode');
const router = require('express').Router();

const docker = new Docker();
const logger = log4js.getLogger('Image');

router.get('/', (req, res) => {
    docker.listImages({
        all: true
    }).then(list => {
        res.status(200).json(list);
    }).catch(err => {
        logger.error(err);
        res.status(500).json({ message: err.message });
    });
});

router.get('/export', (req, res) => {
    try {
        if (!req.query.filename || !req.query.tag) {
            res.status(400).json({ message: 'Invalid Request' });
        }
        const image = docker.getImage(req.query.tag);
        if (!image) {
            res.status(400).json({ message: 'Invalid Request' });
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
            res.status(400).json({ message: 'Invalid Request' });
        }
        let image;
        if (req.query.id) {
            image = docker.getImage(req.query.id);
        }
        if (req.query.tag) {
            image = docker.getImage(req.query.tag);
        }
        if (!image) {
            res.status(400).json({ message: 'Invalid Request' });
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
            res.status(400).json({ message: 'Invalid Request' });
        }
        const image = docker.getImage(req.query.id);
        if (!image) {
            res.status(400).json({ message: 'Invalid Request' });
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

module.exports = router;