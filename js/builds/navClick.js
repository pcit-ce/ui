const current = require('./current');
const branches = require('./branches');
const builds_history = require('./builds_history');
const pull_requests = require('./pull_requests');
const settings = require('./settings');
const requests = require('./requests');
const caches = require('./caches');
const trigger_build = require('./triggerBuild');
const jobs = require('./jobs');
const repo = require('./repo');

const url = require('./url');

const token = require('../common/token');

const changeUrl = require('./changeUrl');

const navClick = (id, change_url = true) => {
  if (id === 'buildNav') {
    builds_history.handle(url);
    return;
  }

  if (id === 'jobNav') {
    jobs.handle(url);
    return;
  }

  change_url && changeUrl(id);

  switch (id) {
    case 'current':
      current.handle(url);
      break;

    case 'branches':
      branches.handle(url);

      break;

    case 'builds':
      builds_history.handle(url);

      break;

    case 'pull_requests':
      pull_requests.handle(url);

      break;

    case 'settings':
      settings.handle(url, token);
      break;

    case 'caches':
      caches.handle(url, token);
      break;

    case 'requests':
      requests.handle(url, token);
      break;

    case 'trigger_build':
      trigger_build.handle(url);
      break;

    case 'repo':
      repo.handle(
        url.getGitType(),
        url.getUsername(),
        token.getToken(url.getGitType()),
      );
      break;
  }
};

module.exports = navClick;
