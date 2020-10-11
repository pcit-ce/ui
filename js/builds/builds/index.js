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

    let { jobs, build_status } = data;

    data.status = build_status;

    details.show(data, url);

    // jobs 为空
    if (jobs.length === 0) {
      log.show(null, null);

      return;
    }

    // 展示 jobs 列表
    job_list.show(data, url);
  },
};
