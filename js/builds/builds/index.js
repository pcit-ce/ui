import details from '../log/details';
const job_list = require('./job_list');
const log = require('../log');

export default {
  show: (data, url) => {
    // console.log(data);

    // 没有 build 数据
    if (!data) {
      log.show(null, null);

      return;
    }

    let { jobs, build_id, build_status, config } = data;

    data.status = build_status;

    details.show(data, url);

    // jobs 为空
    if (jobs.length === 0) {
      log.show(null, null);

      return;
    }

    // 只有一个 job 直接展示日志
    if (jobs.length === 1) {
      data.id = build_id;
      let { build_log, id: job_id, env_vars = null } = jobs[0];
      log.show(build_log, env_vars, job_id, config);

      return;
    }

    // 有多个 job ,展示 jobs 列表
    job_list.show(data, url);
  },
};
