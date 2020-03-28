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

    $.each(data, function (id, status) {
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

      let commit_message_array = commit_message.split('\n');

      let signed = false;

      commit_message_array.forEach((element, index, arr) => {
        if (element.substr(0, 14) === 'Signed-off-by:') {
          signed = element.substr(15);
          arr.splice(index, 1);
        }
      });

      commit_message = commit_message_array.join('\n');

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
      let build_status_icon = common_status.getIcon(build_status);

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
          $('<div class="pull_request_icon"></div>')
            .append(build_status_icon)
            .attr('title', `base branch is ${branch}`)
            .css('color', status_color),
        )
        .append(
          $('<a class="pull_request_url text-truncate"></a>')
            .append(
              '<svg t="1583662298995" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2228" width="18" height="18"><path d="M256 128c-70.58 0-128 57.42-128 128 0 47.274 25.78 88.614 64 110.782l0 354.438C153.78 743.386 128 784.726 128 832c0 70.58 57.42 128 128 128s128-57.42 128-128c0-47.274-25.78-88.614-64-110.782L320 366.782c38.22-22.168 64-63.508 64-110.782C384 185.42 326.58 128 256 128zM256 896c-35.346 0-64-28.654-64-64s28.654-64 64-64 64 28.654 64 64S291.346 896 256 896zM256 320c-35.346 0-64-28.654-64-64s28.654-64 64-64 64 28.654 64 64S291.346 320 256 320z" p-id="2229" fill="#666666"></path><path d="M830 720.068 830 409.978c0-67.974-20.98-122.004-62.36-160.588-44.222-41.236-108.628-60.776-191.64-58.212L576 64l-192 192 192 192 0-128c53 0 85.34 5.284 104.35 23.008 14.366 13.396 21.65 35.928 21.65 66.97l0 312.392c-37.124 22.434-62 63.178-62 109.628 0 70.58 57.42 128 128 128s128-57.42 128-128C896 783.902 869.324 741.938 830 720.068zM768 896c-35.346 0-64-28.654-64-64s28.654-64 64-64 64 28.654 64 64S803.346 896 768 896z" p-id="2230" fill="#666666"></path></svg> ' +
                `#PR ${pull_request_id}`,
            )
            // .attr('title', `base branch is ${branch}`)
            .attr({
              title: 'View pull request on GitHub',
              href: pull_request_url,
              target: '_block',
            })
            .css('color', status_color),
        )
        .append(
          $('<div class="committer text-truncate"></div>')
            .append(committer_username)
            .attr(
              'title',
              signed
                ? `COMMIT BY ${committer_username},\nSIGNED  BY ${signed}`
                : `COMMIT BY ${committer_username}`,
            ),
        )
        .append(
          $(
            '<div class="commit_message text-truncate"><svg t="1583509372477" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="39924" width="20" height="20"><path d="M863.573333 102.4 160.426667 102.4C109.226667 102.4 68.266667 143.36 68.266667 197.973333l0 508.586667c0 51.2 40.96 95.573333 92.16 95.573333l191.146667 0c6.826667 0 13.653333 3.413333 17.066667 6.826667l75.093333 81.92c17.066667 20.48 40.96 30.72 68.266667 30.72s51.2-10.24 68.266667-30.72l75.093333-81.92c3.413333-6.826667 10.24-6.826667 17.066667-6.826667l191.146667 0c51.2 0 92.16-40.96 92.16-95.573333L955.733333 197.973333C955.733333 143.36 914.773333 102.4 863.573333 102.4zM887.466667 706.56c0 13.653333-10.24 27.306667-23.893333 27.306667l-191.146667 0c-27.306667 0-51.2 10.24-68.266667 30.72l-75.093333 81.92c-10.24 10.24-27.306667 10.24-34.133333 0l-75.093333-81.92c-17.066667-20.48-40.96-30.72-68.266667-30.72L160.426667 733.866667c-13.653333 0-23.893333-10.24-23.893333-27.306667L136.533333 197.973333C136.533333 180.906667 146.773333 170.666667 160.426667 170.666667l703.146667 0C877.226667 170.666667 887.466667 180.906667 887.466667 197.973333L887.466667 706.56z" p-id="39925" fill="#666666"></path><path d="M508.586667 436.906667m-61.44 0a1.8 1.8 0 1 0 122.88 0 1.8 1.8 0 1 0-122.88 0Z" p-id="39926" fill="#666666"></path><path d="M720.213333 436.906667m-61.44 0a1.8 1.8 0 1 0 122.88 0 1.8 1.8 0 1 0-122.88 0Z" p-id="39927" fill="#666666"></path><path d="M300.373333 436.906667m-61.44 0a1.8 1.8 0 1 0 122.88 0 1.8 1.8 0 1 0-122.88 0Z" p-id="39928" fill="#666666"></path></svg> </div>',
          )
            .append(commit_message.slice(0, 40))
            .attr('title', commit_message),
        )
        .append(
          $(
            '<a class="commit_id"><svg t="1583547352748" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2241" width="20" height="20"><path d="M960 576H692.224c-26.432 74.432-96.704 128-180.224 128-83.456 0-153.792-53.568-180.224-128H64a64 64 0 1 1 0-128h267.776c26.432-74.368 96.768-128 180.224-128 83.52 0 153.792 53.632 180.224 128H960c35.392 0 64 28.608 64 64s-28.608 64-64 64z m-448-128a64 64 0 1 0 0 128c35.392 0 64-28.608 64-64s-28.608-64-64-64z" fill="#666666" p-id="2242"></path></svg> </a>',
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
  handle: (url) => {
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
