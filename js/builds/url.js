const git = require('../common/git');
const app = require('../common/app');

const getUrl = () => {
  return location.href;
};

const getHost = () => {
  // https://ci2.khs1994.com:10000
  return location.origin;
};

const getUrlWithArray = () => {
  let url = getUrl();
  const length = url.length;
  if (url[length - 1] === '/') {
    url = url.substr(0, length - 1);
  }

  return url.split('/');
};

const getGitType = () => {
  return getUrlWithArray()[3];
};

const getUsername = () => {
  return getUrlWithArray()[4];
};

const getRepo = () => {
  return getUrlWithArray()[5];
};

const getRepoFullName = () => {
  return getUsername() + '/' + getRepo();
};

const getGitRepoFullName = () => {
  return getGitType() + '/' + getRepoFullName();
};

const getRepoFullNameUrl = () => {
  return getHost() + '/' + getGitRepoFullName();
};

const getJobId = () => {
  return getUrlWithArray()[7];
};

const getType = () => {
  let type_from_url = getUrlWithArray()[6];

  if (5 === getUrlWithArray().length) {
    return 'repo';
  }

  if (6 === getUrlWithArray().length) {
    return 'current';
  }

  return type_from_url;
};

const getBaseTitle = () => {
  return (
    git.format(getGitType()) + ' - ' + getRepoFullName() + ' - ' + app.app_name
  );
};

export default {
  getUrl,
  getUrlWithArray,
  getHost,
  getGitType,
  getUsername,
  getRepo,
  getRepoFullName,
  getGitRepoFullName,
  getRepoFullNameUrl,
  getType,
  getJobId,
  getBaseTitle,
};
