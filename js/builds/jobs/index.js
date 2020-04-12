import pcit from '@pcit/pcit-js';

import details from '../log/details';
const log = require('../log');
import { showBuildNav } from '../builds_history';

const showJobNav = (job_id) => {
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
  log.show(job_log, env_vars, job_id, build_data.config);

  // let column_el = $('#pull_requests');
}

export default {
  handle: (url) => {
    let job_id = url.getUrlWithArray()[5];

    const jobs = new pcit('', '/api').jobs;
    const builds = new pcit('', '/api').builds;

    (async () => {
      let job_data = await jobs.find(job_id);
      let { build_id } = job_data;
      let build_data = await builds.find(build_id);
      display(job_data, build_data, url);
      let build_config = build_data.config;

      // sse
      let sse = new EventSource(`${location.origin}/api/job/${job_id}?sse=1`);

      sse.onmessage = async function (evt) {
        let { data: job_data, lastEventId, readyState } = evt;

        let { build_log: job_log, env_vars = null } = JSON.parse(job_data);
        log.show(job_log, env_vars, job_id, build_config);

        let { hash } = location;

        if (hash) {
          $(`.build_log_item${hash}`).attr('open', true);
        }
      };

      // close sse
      sse.addEventListener('close', (evt) => {
        let { data: job_data, lastEventId, readyState } = evt;

        let { build_log: job_log, env_vars = null } = JSON.parse(job_data);
        log.show(job_log, env_vars, job_id, build_config);

        let { hash } = location;

        if (hash) {
          $(`.build_log_item${hash}`).attr('open', true);
        }

        sse.close();
      });
    })();
  },
};
