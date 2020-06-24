const common_status = require('../../common/status');
const git = require('../../common/git');
const time = require('../time');
const formatTime = time.formatTime;
const formatTotal = time.formatTotal;

import gpg_verified_icon from '../../icon/gpg_verified';
import branch_icon from '../../icon/branch';
import commit_icon from '../../icon/commit';
import time_ago_icon from '../../icon/time_ago';
import clock_icon from '../../icon/clock';
import cancel_icon from '../../icon/cancel';
import refresh_icon from '../../icon/refresh';
import account_icon from '../../icon/account';

export default {
  show: (data, url, job = false) => {
    // console.log(data);
    let display_element = $('#display');

    // TODO: loading
    display_element.empty().append(`
<div class="spinner-grow text-secondary" role="status">
  <span class="sr-only">Loading...</span>
</div>
`);

    let {
      id,
      status,
      commit_id,
      commit_message,
      branch,
      committer_name,
      committer_username,
      compare,
      begin_at = 0,
      finished_at: stopped_at,
      env_vars,
      jobs,
    } = data;

    let status_color;

    committer_name = committer_name ? committer_name : committer_username;

    let {
      handle: button_handle,
      title: button_title,
    } = common_status.getButton(status);
    status_color = common_status.getColor(status);
    let build_status = common_status.change(status);

    let stopped_time;
    let stopped_title;
    let stopped_string;

    // console.log(build_status);
    if (null === stopped_at) {
      stopped_string = 'This build is ' + build_status;
    } else {
      stopped_time = new Date(parseInt(stopped_at) * 1000);
      stopped_string = formatTime(stopped_at);
      stopped_title = 'Finished ' + stopped_time.toLocaleString();
    }

    let commit_url = git.getCommitUrl(
      url.getUsername(),
      url.getRepo(),
      commit_id,
    );

    let branchUrl = git.getBranchUrl(url.getUsername(), url.getRepo(), branch);

    let div_element = $('<div class="build_data"></div>');

    let job_id = null;

    if (jobs && jobs.length === 1) {
      job_id = jobs[0]['id'];
    }

    div_element
      .append(
        $('<div class="build_id"></div>')
          .append('')
          .css({
            background: status_color,
            border: '1px solid ' + status_color,
          }),
      )
      // .append(
      //   $('<div class="branch text-truncate"></div>')
      //     .append($('<strong></strong>').append(branch.slice(0, 7)))
      //     .attr('title', branch)
      //     .css('color', status_color),
      // )
      .append(
        $(`<a class="branch_url text-truncate">${branch_icon} Branch </a>`)
          .append(branch)
          .attr({
            href: branchUrl,
            target: '_block',
            title: 'View branch on GitHub',
          }),
      )
      .append(
        $('<div class="build_status"></div>')
          .append(
            $('<strong></strong>').append(
              '#' + (job_id ? `${id}-${job_id}` : id) + ' ' + build_status,
            ),
          )
          .css('color', status_color),
      )
      .append(
        $(`<a class="commit_url">${commit_icon} Commit </a>`)
          .append(commit_id.slice(0, 7))
          .attr({
            title: 'View commit on GitHub',
            href: commit_url,
            target: '_blank',
          }),
      );

    let commit_message_array = commit_message.split('\n');

    let signed = false;

    commit_message_array.forEach((element, index, arr) => {
      if (element.substr(0, 14) === 'Signed-off-by:') {
        signed = element.substr(15);
        arr.splice(index, 1);
      }
    });

    commit_message = commit_message_array.join('\n');

    div_element
      .append(
        $('<div class="commit_message text-truncate"></div>')
          .append(commit_message)
          .attr('title', commit_message)
          .css('color', status_color),
      )
      .append(
        $('<div class="committer text-truncate"> </div>')
          .append(account_icon)
          .append(committer_name + (signed ? '&nbsp' + gpg_verified_icon : ''))
          .attr(
            'title',
            signed
              ? `COMMIT BY ${committer_name}\nSIGNED  BY ${signed}`
              : `COMMIT BY ${committer_name}`,
          ),
      );

    // div_element.append(
    //   $('<a class="compare"></a>')
    //     .append('Compare')
    //     .attr({
    //       title: 'View diff on GitHub',
    //       href: compare,
    //       target: '_blank',
    //     }),
    // );

    div_element
      // 总用时
      .append(
        $('<div class="build_time"> </div>')
          .append(clock_icon)
          .append('Total time 7 min 17 sec'),
      )
      .append(
        $('<div class="build_time_ago"> </div>')
          .append(time_ago_icon)
          .append(stopped_string)
          .attr({
            title: stopped_title,
          }),
      )
      .append(
        $('<button class="cancel_or_restart"></button>')
          .append(button_handle === 'cancel' ? cancel_icon : refresh_icon)
          .attr('handle', button_handle)
          .attr({
            title: button_title + (job ? ' job' : ' build'),
            event_id: id,
            job_or_build: job ? 'job' : 'build',
          })
          .addClass('btn btn-link'),
      );
    // .append($('<div class="env"></div>').append(env_vars));
    div_element.css({
      display: 'none',
    });

    display_element.empty().append(div_element);

    div_element.fadeIn(500);
  },
};
