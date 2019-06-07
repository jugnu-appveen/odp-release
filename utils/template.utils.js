const path = require('path');

module.exports.cloneRepoScript = (data, accessData) => {
    return `
    cd ${path.join(process.cwd(), 'repos')}
    echo '=======${path.join(process.cwd(), 'repos')}======='
    && rm -rf ${data.name}
    && git clone ${getNewUrl(data.url, accessData.username, accessData.accessToken)} ${data.name}
    && cd ${data.name}
    && git checkout ${data.branch}
    `;
};

module.exports.updateRepoScript = (data) => {
    return `
    cd ${path.join(process.cwd(), 'repos', data.name)}
    git reset --hard
    git pull origin ${data.branch}
    `;
};

function getNewUrl(url, username, accessToken) {
    return url.replace(/^(https:\/\/).+(@.+\.git)$/, `$1${username + ':' + accessToken}$2`)
}