const path = require('path');

module.exports.cloneRepoScript = (data, accessData) => {
    return `
    cd ${path.join(process.cwd(), 'repos')}
    rm -rf ${data.name}
    git clone ${getNewUrl(data.url, accessData.username, accessData.accessToken)} ${data.name}
    cd ${data.name}
    git checkout ${data.branch}
    `;
};

module.exports.updateRepoScript = (data) => {
    return `
    cd ${path.join(process.cwd(), 'repos', data.name)}
    git reset --hard
    git pull origin ${data.branch}
    `;
};

module.exports.deleteRepoScript = (data) => {
    return `
    rm -rf ${path.join(process.cwd(), 'repos', data.name)}
    `;
};

module.exports.listBranchScript = (data) => {
    return `
    cd ${path.join(process.cwd(), 'repos', data.name)}
    git branch -a
    `;
};

module.exports.buildImageScript = (data) => {
    return `
    cd ${path.join(process.cwd(), 'repos', data.name)} 
    git reset --hard
    git checkout ${data.branch}
    git pull origin ${data.branch}
    ${data.script}
    docker build -t ${data.tag} .
    `;
};

module.exports.releaseScript = (data) => {
    let script = '';
    for (let i = 0; i < data.repos.length; i++) {
        const repo = data.repos[i];
        script += `
        echo '============== ${data.release}:${repo.tag} - ${repo.name} =============='
        cd ${path.join(process.cwd(), 'repos', repo.name)}
        git pull origin dev
        git checkout -B ${data.release}
        git pull origin ${data.release}
        ${repo.script}
        docker build -t ${repo.tag}.${data.release} .
        `;
    }
    return script;
};

function getNewUrl(url, username, accessToken) {
    return url.replace(/^(https:\/\/).+(@.+\.git)$/, `$1${username + ':' + accessToken}$2`)
}