module.exports = {
  format: gittype => {
    switch (gittype) {
      case 'github':
        return 'GitHub';

      default:
        return gittype.substring(0, 1).toUpperCase() + gittype.substring(1);
    }
  },

  getUrl: (username, repo, gitType = 'github') => {
    let url;
    switch (gitType) {
      case 'github':
        url = `https://github.com/${username}`;
        break;
      case 'gitee':
        url = `https://gitee.com/${username}`;
        break;
    }

    url = repo ? `${url}/${repo}` : url;

    return url;
  },

  getCommitUrl: (username, repo, commit_id, gitType = 'github') => {
    let commitUrl;

    let repo_full_name = repo ? username + '/' + repo : username;

    switch (gitType) {
      case 'github':
        commitUrl =
          'https://github.com/' + repo_full_name + '/commit/' + commit_id;
        break;

      case 'gitee':
        commitUrl = `https://gitee.com/${repo_full_name}/commit/${commit_id}`;

        break;
    }

    return commitUrl;
  },

  getBranchUrl: (username, repo, branch, gitType = 'github') => {
    let branchUrl;

    let repo_full_name = repo ? username + '/' + repo : username;

    switch (gitType) {
      case 'github':
        branchUrl = 'https://github.com/' + repo_full_name + '/tree/' + branch;
        break;

      case 'gitee':
        branchUrl = `https://gitee.com/${repo_full_name}/tree/${branch}`;

        break;
    }

    return branchUrl;
  },

  getPullRequestUrl: (username, repo, pull_request_id, gitType = 'github') => {
    let prUrl;

    switch (gitType) {
      case 'github':
        prUrl = `https://github.com/${username}/${repo}/pull/${pull_request_id}`;

        break;

      case 'gitee':
        prUrl = `https://gitee.com/${username}/${repo}/pulls/${pull_request_id}`;

        break;
    }

    return prUrl;
  },

  getIcoUrl(gitType = 'github') {
    return '/ico/' + gitType + '.png';
  },
};
