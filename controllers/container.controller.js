const log4js = require('log4js');
const Docker = require('dockerode');
const router = require('express').Router();

const docker = new Docker();
const logger = log4js.getLogger('Container');

router.get('/', (req, res) => {
    docker.listContainers({
        all: true
    }).then(list => {
        res.status(200).json(list);
    }).catch(err => {
        logger.error(err);
        res.status(500).json({ message: err.message });
    });
});

router.put('/start/:id', (req, res) => {
    if (!req.params.id) {
        res.status(400).json({ message: 'Invalid Request' });
    }
    docker.getContainer(req.params.id).then(container => {
        if (!container) {
            res.status(400).json({ message: 'Invalid Request' });
        } else {
            container.start();
        }
    }).catch(err => {
        logger.error(err);
        res.status(500).json({ message: err.message });
    });
});

router.put('/stop/:id', (req, res) => {
    if (!req.params.id) {
        res.status(400).json({ message: 'Invalid Request' });
    }
    docker.getContainer(req.params.id).then(container => {
        if (!container) {
            res.status(400).json({ message: 'Invalid Request' });
        } else {
            container.stop();
        }
    }).catch(err => {
        logger.error(err);
        res.status(500).json({ message: err.message });
    });
});

router.get('/logs/:id', (req, res) => {
    if (!req.params.id) {
        res.status(400).json({ message: 'Invalid Request' });
    }
    docker.getContainer(req.params.id).then(container => {
        if (!container) {
            res.status(400).json({ message: 'Invalid Request' });
        } else {
            res.status(200).json({ logs: container.logs() });
        }
    }).catch(err => {
        logger.error(err);
        res.status(500).json({ message: err.message });
    });
});

router.delete('/:id', (req, res) => {
    if (!req.params.id) {
        res.status(400).json({ message: 'Invalid Request' });
    }
    docker.getContainer(req.params.id).then(container => {
        if (!container) {
            res.status(400).json({ message: 'Invalid Request' });
        } else {
            container.remove({
                force: true
            });
        }
    }).catch(err => {
        logger.error(err);
        res.status(500).json({ message: err.message });
    });
});

module.exports = router;