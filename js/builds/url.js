const git = require('../common/git');
const app = require('../common/app');

const getPathname = () => {
  return location.pathname;
};

const getHost = () => {
  // https://ci2.khs1994.com:10000
  return location.origin;
};

const getUrlWithArray = () => {
  let url = getPathname();

  return url.split('/');
};

const getGitType = () => {
  return getUrlWithArray()[1];
};

const getUsername = () => {
  return getUrlWithArray()[2];
};

const getRepo = () => {
  return getUrlWithArray()[3];
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
  return getUrlWithArray()[5];
};

const getType = () => {
  let type_from_url = getUrlWithArray()[4];

  if (3 === getUrlWithArray().length) {
    return 'repo';
  }

  if (4 === getUrlWithArray().length) {
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
  getPathname,
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
