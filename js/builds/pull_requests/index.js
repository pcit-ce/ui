const { column_span_click } = require('../common');
const git = require('../../common/git');
const common_status = require('../../common/status');
const error_info = require('../error/error').error_info;
const formatTime = require('../time').formatTime;
const formatTotal = require('../time').formatTotal;

import pcit from '@pcit/pcit-js';
const builds = new pcit('', '').builds;

function display(data, url, append = false) {
  let display_element = $('#display');

  !append && display_element.empty();

  if (0 === data.length) {
    display_element
      .hide()
      .append(error_info('No pull request builds for this repository'))
      .fadeIn(500);
    // display_element.innerHeight(55);
  } else {
    let ul_el = append
      ? $('.pull_requests_list')
      : $('<ul class="pull_requests_list"></ul>');

    // display_element.height((data.length + 1) * 100);

    $.each(data, function(id, status) {
      let {
        pull_request_number: pull_request_id,
        id: build_id,
        branch,
        committer_username,
        commit_message,
        commit_id,
        build_status,
        total_time,
        finished_at: stopped_at,
      } = status;

      let username = url.getUsername();
      let repo = url.getRepo();
      let repo_full_name_url = url.getRepoFullNameUrl();

      let commit_url = git.getCommitUrl(username, repo, commit_id);

      let pull_request_url = git.getPullRequestUrl(
        username,
        repo,
        pull_request_id,
      );

      commit_id = commit_id.substr(0, 7);

      if (null == total_time || total_time <= 0) {
        total_time = 'Pending';
      } else {
        total_time = formatTotal(total_time);
      }

      let stopped_at_title;

      if (null == stopped_at) {
        stopped_at = 'Pending';
      } else {
        let d;
        d = new Date(stopped_at * 1000);
        stopped_at = formatTime(stopped_at);
        stopped_at_title = d.toLocaleString();
      }

      let status_color;

      let {
        title: button_title,
        handle: button_handle,
      } = common_status.getButton(build_status);
      status_color = common_status.getColor(build_status);
      build_status = common_status.change(build_status);
      // const className = common_status.getClassName(build_status);

      let li_el = $('<li class="pull_requests_list_item"></li>');

      li_el
        // .append($('<div class="id"></div>').append())
        .append(
          $('<div class="build_id"></div>').css({
            background: status_color,
            border: '1px solid' + status_color,
          }),
        )
        // .addClass(className)
        .attr({
          'data-id': build_id,
        })
        .append(
          $('<a class="pull_request_url text-truncate"></a>')
            .append(`#PR ${pull_request_id}`)
            .attr({
              title: 'View pull request on GitHub',
              href: pull_request_url,
              target: '_block',
            })
            .css('color', status_color),
        )
        .append(
          $('<div class="branch text-truncate"></div>')
            .append($('<strong></strong>').append(branch))
            .attr('title', branch)
            .css('color', status_color),
        )
        .append(
          $('<div class="committer text-truncate"></div>')
            .append(committer_username)
            .attr('title', committer_username),
        )
        .append(
          $(
            '<div class="commit_message text-truncate"><i class="material-icons md-16">all_inclusive</i> </div>',
          )
            .append(commit_message.slice(0, 40))
            .attr('title', commit_message),
        )
        .append(
          $(
            '<a class="commit_id"><i class="material-icons md-16">linear_scale</i> </a>',
          )
            .append(commit_id)
            .attr({
              href: commit_url,
              target: '_block',
              title: 'View commit on GitHub',
            }),
        )
        .append(
          $('<a class="build_status"></a>')
            .append(
              $('<strong></strong>').append(
                '#' + build_id + ' ' + build_status,
              ),
            )
            .attr({
              href: `${repo_full_name_url}/builds/${build_id}`,
              target: '_self',
            })
            .css('color', status_color),
        )
        .append(
          $(
            '<div class="build_time"><i class="material-icons md-16">alarm_on</i> </div>',
          ).append(total_time),
        )
        .append(
          $(
            '<div class="build_time_ago"><i class="material-icons md-16">event_note</i> </div>',
          )
            .append(stopped_at)
            .attr('title', stopped_at_title),
        )
        .append(
          $('<button class="cancel_or_restart"></button>')
            .append(
              $('<i class="material-icons"></i>').append(
                button_handle === 'cancel' ? 'highlignt_off' : 'refresh',
              ),
            )
            .attr({
              handle: button_handle,
              title: button_title + ' build',
              event_id: build_id,
              job_or_build: 'build',
            })
            .addClass('btn btn-link'),
        );
      li_el.css({
        display: 'none',
      });

      ul_el.append(li_el);
    });

    if (append) {
      $('.pull_requests_list_item').fadeIn(500);
      return;
    }

    display_element.append(ul_el).append(
      $('<button class="pull_requests_list_more btn">More</button>')
        .addClass('btn-success')
        .attr({
          title: '点击加载更多',
        }),
    );

    $('.pull_requests_list_item').fadeIn(500);
  }
}

export default {
  handle: url => {
    column_span_click('pull_requests');

    // $.ajax({
    //   type: 'GET',
    //   url: '/api/repo/' + url.getGitRepoFullName() + '/builds?type=pr',
    //   success: function(data) {
    //     display(data, url);
    //   },
    // });

    (async () => {
      let result = await builds.findByRepo(
        url.getGitType(),
        url.getRepoFullName(),
        undefined,
        true,
      );

      display(result, url);
    })();
  },
  more: (url, before, request = true) => {
    (async () => {
      let result = request
        ? await builds.findByRepo(
            url.getGitType(),
            url.getRepoFullName(),
            undefined,
            true,
            before,
          )
        : [];

      if (JSON.stringify(result) === '[]') {
        alert('没有了呢');

        $('.pull_requests_list_more')
          .attr({
            disabled: 'true',
          })
          .removeClass('btn-success')
          .addClass('btn-light')
          .text('没有了呢');

        return;
      }

      // console.log(result);
      display(result, url, true);
    })();
  },
};
