const path = require('path');
const log4js = require('log4js');
const express = require('express');
const bodyParser = require('body-parser');
const speakeasy = require('speakeasy');

const containerController = require('./controllers/container.controller');
const imageController = require('./controllers/image.controller');
const repoController = require('./controllers/repo.controller');
const keysController = require('./controllers/keys.controller');

const app = express();
const logger = log4js.getLogger('Server');
const authUrls = ['/api/image/export', '/api/image/tag', '/api/image'];

const LOG_LEVEL = process.env.LOG_LEVEL || 'info';
const PORT = process.env.PORT || 4000;
const SECRET = process.env.SECRET || 'itworks@123';

logger.level = LOG_LEVEL;

app.use(express.static(path.join(__dirname, 'dist')));
app.use(bodyParser());

app.use(function (req, res, next) {
    if (authUrls.indexOf(req.path) > -1) {
        const token = req.params.token || req.query.token || req.body.token;
        if (token) {
            if (speakeasy.totp.verify({
                secret: SECRET,
                token: token
            })) {
                next();
            } else {
                res.status(401).json({ message: 'Unauthorised' });
            }
        } else {
            res.status(401).json({ message: 'Unauthorised' });
        }
    } else {
        next();
    }
});

app.use('/api/container', containerController);
app.use('/api/image', imageController);
app.use('/api/repo', repoController);
app.use('/api/keys', keysController);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/index.html'));
});

app.listen(PORT, () => {
    logger.info('Server is listening on port', PORT);
});