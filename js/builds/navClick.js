import current from './current';
import branches from './branches';
import builds_history from './builds_history';
import pull_requests from './pull_requests';
import settings from './settings';
import requests from './requests';
import caches from './caches';
import trigger_build from './triggerBuild';
import jobs from './jobs';
import repo from './repo';

import url from './url';

const token = require('../common/token');

import changeUrl from './changeUrl';

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

export default navClick;
