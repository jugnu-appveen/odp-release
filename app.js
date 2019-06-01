const path = require('path');
const log4js = require('log4js');
const express = require('express');
const bodyParser = require('body-parser');

const containerController = require('./controllers/container.controller');
const imageController = require('./controllers/image.controller');

const app = express();
const logger = log4js.getLogger('Server');

const LOG_LEVEL = process.env.LOG_LEVEL || 'info';
const PORT = process.env.PORT || 4000;

logger.level = LOG_LEVEL;

app.use(express.static(path.join(__dirname, 'dist')));
app.use(bodyParser());

app.use('/api/container', containerController);
app.use('/api/image', imageController);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/index.html'));
});

app.listen(PORT, () => {
    logger.info('Server is listening on port', PORT);
});