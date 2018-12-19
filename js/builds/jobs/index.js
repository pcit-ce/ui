const details = require('../log/details');
const log = require('../log');
const showBuildNav = require('../builds_history').showBuildNav;

const showJobNav = job_id => {
  $('#jobNav')
    .empty()
    .append('Job #' + job_id);

  // build_id span 元素被选中
  $('#jobNav').trigger('click');
};

function display(job_data, build_data, url) {
  let { build_log, id: job_id, build_id } = job_data;

  job_data.log = build_log;
  job_data.commit_id = build_data.commit_id;
  job_data.commit_message = build_data.commit_message;
  job_data.committer_name = build_data.committer_name;
  job_data.status = job_data.state;
  job_data.branch = build_data.branch;

  $('#display').empty();

  showBuildNav(build_id);
  showJobNav(job_id);
  details.show(job_data, url, true);

  let { log: job_log, env_vars = null } = job_data;

  // display log
  log.show(job_log, env_vars);

  // let column_el = $('#pull_requests');
}

module.exports = {
  handle: url => {
    let job_id = url.getUrlWithArray()[7];

    const pcit = require('@pcit/pcit-js');
    const jobs = new pcit.Jobs('', '/api');
    const builds = new pcit.Builds('', '/api');

    (async () => {
      let job_data = await jobs.find(job_id);

      let { build_id } = job_data;

      let build_data = await builds.find(build_id);

      display(job_data, build_data, url);
    })();
  },
};
