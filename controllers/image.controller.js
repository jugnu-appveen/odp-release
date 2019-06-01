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

router.get('/export/:id', (req, res) => {
    try {
        if (!req.params.id || !req.query.filename) {
            res.status(400).json({ message: 'Invalid Request' });
        }
        const image = docker.getImage(req.params.id);
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

router.delete('/:id', (req, res) => {
    try {
        if (!req.params.id) {
            res.status(400).json({ message: 'Invalid Request' });
        }
        const image = docker.getImage(req.params.id);
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

router.put('/tag/:id', (req, res) => {
    try {
        if (!req.params.id || !req.body || !req.body.tag) {
            res.status(400).json({ message: 'Invalid Request' });
        }
        const image = docker.getImage(req.params.id);
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