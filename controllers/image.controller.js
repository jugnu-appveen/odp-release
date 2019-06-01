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

module.exports = router;