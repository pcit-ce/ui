const common_status = require('../../common/status');
const formatTotalTime = require('../time').formatTotal;
const linux_ico = require('../../icon/os/linux');
const clock_ico = require('../../icon/clock_cjs');
const code_ico = require('../../icon/code');
const cancel_icon = require('../../icon/cancel_cjs');
const refresh_icon = require('../../icon/refresh_cjs');

module.exports = {
  // list one build all jobs
  show: (data, url) => {
    let display_el = $('#display');

    let jobs_list_el = $('<div class="jobs_list"></div>');

    let { jobs } = data;

    let git_type = url.getGitType();

    let job_url =
      '/' + [git_type, url.getUsername(), url.getRepo(), 'jobs'].join('/');

    // display_el.innerHeight((jobs.length + 1) * 100);

    $.each(jobs, (index, job) => {
      let { id, started_at, finished_at, state, env_vars = '' } = job;

      if (env_vars) {
        let obj = JSON.parse(env_vars);

        for (let index in obj) {
          env_vars = `${index}: ${obj[index]}`;

          break;
        }
      } else {
        env_vars = 'no matrix environment set';
      }

      let status_color = common_status.getColor(state);
      let status_background_color = common_status.getColor(state, true);
      let {
        class: button_class,
        handle: button_handle,
        title: button_title,
      } = common_status.getButton(state);

      let a_el = $('<a class="job_list"></a>');

      let runTotalTime;
      let runTotalTimeTitle;

      if (null === finished_at) {
        runTotalTime = 'Build is ' + state;
      } else {
        runTotalTime = 'Run ' + formatTotalTime(finished_at - started_at);
        runTotalTimeTitle =
          'Finished ' + new Date(finished_at * 1000).toLocaleString();
      }

      a_el
        .append(() => {
          return $('<div class="job_id"></div>')
            .append('# ' + id)
            .css('color', status_color);
        })
        .append(() => {
          return $('<div class="job_os"></div>').append(linux_ico + ' x86_64');
        })
        .append(() => {
          return $('<div class="job_env_vars"> </div>')
            .append(code_ico)
            .append(env_vars)
            .attr('title', 'click to see more setting env');
        })
        .append(() => {
          return $('<div class="job_run_time"> </div>')
            .append(clock_ico)
            .append(runTotalTime)
            .attr({
              title: runTotalTimeTitle,
            });
        })
        .append(() => {
          return $('<button class="job_cancel_or_restart" type="button"/>')
            .append(button_handle === 'cancel' ? cancel_icon : refresh_icon)
            .addClass('btn btn-link')
            .attr('handle', button_handle)
            .attr('title', button_title + ' job')
            .attr('event_id', id)
            .attr('job_or_build', 'job');
        })
        .attr('href', job_url + '/' + id)
        .css({
          cursor: 'hand',
          display: 'none',
        })
        .attr('status_background_color', status_background_color)
        .attr('status_color', status_color);

      jobs_list_el.append(a_el);
    });

    display_el.append(jobs_list_el);

    // $('.job_list').slideDown(1000);
    $('.job_list').fadeIn(500);

    // display_el.css('height', (jobs.length * 10) + 'px');

    // 鼠标移入 job list 背景变色
    $('.job_list').on({
      mousemove: function () {
        let that = $(this);
        let background_color = that.attr('status_background_color');
        let border_color = that.attr('status_color');

        $(this)
          .css('background', background_color)
          .css('border-left', '5px solid ' + border_color);
      },
      mouseout: function () {
        let that = $(this);

        that.css('background', 'none').css('border-left', '5px solid white');
      },
    });
  },
};
