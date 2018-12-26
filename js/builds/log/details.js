const common_status = require('../../common/status');
const git = require('../../common/git');
const time = require('../time');
const formatTime = time.formatTime;
const formatTotal = time.formatTotal;

module.exports = {
  show: (data, url, job = false) => {
    // console.log(data);
    let display_element = $('#display');

    let {
      id,
      status,
      commit_id,
      commit_message,
      branch,
      committer_name,
      compare,
      begin_at = 0,
      finished_at: stopped_at,
      env_vars,
    } = data;

    let status_color;

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

    let div_element = $('<div class="build_data"></div>').css(
      'border-left',
      '8px solid ' + status_color,
    );

    // div_element.append(() => {
    //   let build_id_element = $('<div class="build_id"></div>');
    //   build_id_element.append('').css({
    //     background: status_color,
    //     border: '1px solid ' + status_color,
    //   });
    //   return build_id_element;
    // });

    div_element
      .append(
        $('<div class="branch"></div>')
          .append($('<strong></strong>').append(branch.slice(0, 7)))
          .attr('title', branch)
          .css('color', status_color),
      )
      .append(
        $(
          '<a class="branch_url"><i class="material-icons md-16">book</i> Branch </a>',
        )
          .append(branch)
          .attr({ href: '', target: '_block', title: 'View branch on GitHub' }),
      )
      .append(
        $(
          '<div class="build_status"><i class="material-icons md-16">swap_vert</i> </div>',
        )
          .append($('<strong></strong>').append('#' + id + ' ' + build_status))
          .css('color', status_color),
      )
      .append(
        $(
          '<a class="commit_url"><i class="material-icons md-16">line_style</i> Commit </a>',
        )
          .append(commit_id.slice(0, 7))
          .attr({
            title: 'View commit on GitHub',
            href: commit_url,
            target: '_blank',
          }),
      );

    div_element
      .append(
        $('<div class="commit_message"></div>')
          .append(commit_message)
          .attr('title', commit_message)
          .css('color', status_color),
      )
      .append(
        $(
          '<div class="committer"><i class="material-icons md-16">account_circle</i> </div>',
        )
          .append(committer_name)
          .attr('title', committer_name),
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
        $(
          '<div class="build_time"><i class="material-icons md-16">alarm_on</i> </div>',
        ).append('Total time 7 min 17 sec'),
      )
      .append(
        $(
          '<div class="build_time_ago"><i class="material-icons md-16">alarm</i> </div>',
        )
          .append(stopped_string)
          .attr({
            title: stopped_title,
          }),
      )
      .append(
        $('<button class="cancel_or_restart"></button>')
          .append(
            $('<i></i>')
              .addClass('material-icons')
              .append(button_handle === 'cancel' ? 'highlight_off' : 'refresh'),
          )
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

    display_element.append(div_element);

    div_element.fadeIn(1000);
  },
};
