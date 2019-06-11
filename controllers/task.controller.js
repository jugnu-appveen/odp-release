const path = require('path');
const log4js = require('log4js');
const jsonfile = require('jsonfile');
const uniqueToken = require('unique-token');
const router = require('express').Router();

const templateUtils = require('../utils/template.utils');
const scriptUtils = require('../utils/script.utils');

const logger = log4js.getLogger('Repo');
const filePath = path.join(process.cwd(), 'db/tasks.json');
const configFilePath = path.join(process.cwd(), 'db/config.json');
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
        body._id = uniqueToken.token();
        data.push(body);
        const config = jsonfile.readFileSync(configFilePath) || {};
        const script = templateUtils.cloneRepoScript(body, config.access);
        scriptUtils.execScript(script).then(status => {
            logger.info(status);
        }).catch(err => {
            logger.error(err);
        });
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

router.delete('/', (req, res) => {
    if (!req.query.id) {
        res.status(400).json({ message: 'Bad Request' });
    }
    jsonfile.readFile(filePath).then(data => {
        if (!data) {
            data = [];
        }
        const index = data.findIndex(e => e._id == req.query.id);
        if (index > -1) {
            const temp = data[index];
            scriptUtils.execScript(templateUtils.deleteRepoScript(temp)).then(status => {
                logger.info(status, temp.name, 'deleted successfully');
            }).catch(err => {
                logger.error(err);
            });
            data.splice(index, 1);
            jsonfile.writeFile(filePath, data).then(saved => {
                res.status(200).json({ message: temp.name + ' deleted successfully.' });
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

router.get('/branch', (req, res) => {
    try {
        jsonfile.readFile(filePath).then(data => {
            if (!data) {
                data = [];
            }
            const index = data.findIndex(e => e._id == req.query.id);
            if (index > -1) {
                const temp = data[index];
                scriptUtils.execScript(templateUtils.listBranchScript(temp)).then(status => {
                    if(status){
                        const branchList = status.split('\n')
                        .map(e=>e.split('/').pop())
                        .map(e=>e.replace(/\*/,''));
                        res.status(200).json(branchList);
                    } else {
                        res.status(200).json([]);
                    }
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
    } catch (err) {
        logger.error(err);
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;