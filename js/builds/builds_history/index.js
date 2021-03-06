const { column_span_click } = require('../common');
const git = require('../../common/git');
import builds from '../builds';
const common_status = require('../../common/status');
const build_not_find = require('../error/error').error_info;
const formatTime = require('../time').formatTime;
import pcit from '@pcit/pcit-js';
const pcit_builds = new pcit('', '').builds;

import branch_icon from '../../icon/branch';
import tag_icon from '../../icon/tag';
import commit_icon from '../../icon/commit';
import commit_message_icon from '../../icon/commit_message';
import time_ago_icon from '../../icon/time_ago';
import clock_icon from '../../icon/clock';
import cancel_icon from '../../icon/cancel';
import refresh_icon from '../../icon/refresh';

export const showBuildNav = (build_id, trigger = false) => {
  $('#buildNav')
    .empty()
    .append('Build #' + build_id)
    .attr({
      'data-buildId': build_id,
    });

  // build_id span 元素被选中
  trigger && $('#buildNav').trigger('click');
};

function display(data, url, append = false) {
  let display_element = $('#display');

  if (0 === data.length) {
    display_element
      .empty()
      .append(build_not_find('Not Build Yet !', '', ''))
      .fadeIn(500);

    return;
  }

  !append && display_element.empty();

  let url_array = url.getUrlWithArray();

  // console.log(url_array);

  if (6 === url_array.length) {
    // 展示某个 build 详情
    if (0 === data.length || 'error' === data) {
      display_element
        .hide()
        .append(
          build_not_find(
            "Oops, we couldn't find that build!",
            '',
            'The build not exist.',
          ),
        )
        .fadeIn(500);
      // display_element.innerHeight(55);
      return;
    }

    // 展示某个 build
    showBuildNav(data.id, true);

    builds.show(data, url);

    return;
  }

  let i = data.length + 1;
  let ul_el = append ? $('.builds_list') : $('<ul class="builds_list"></ul>');
  // display_element.innerHeight((i + 1) * 100);
  // display_element.innerHeight(i * 100);
  $.each(data, function (id, status) {
    i--;

    let {
      event_type,
      id: build_id,
      branch,
      committer_name,
      committer_username,
      commit_message,
      commit_id,
      build_status,
      started_at,
      finished_at: stopped_at,
      tag,
    } = status;

    committer_username =
      committer_username === '' ? committer_name : committer_username;

    let total_time = stopped_at - started_at;

    // commit_message = tag ? tag : commit_message;
    let commit_message_array;

    try {
      commit_message_array = commit_message.split('\n');
    } catch (e) {
      return;
    }

    let signed = false;

    commit_message_array.forEach((element, index, arr) => {
      if (element.substr(0, 14) === 'Signed-off-by:') {
        signed = element.substr(15);
        arr.splice(index, 1);
      }
    });

    commit_message = commit_message_array.join('\n');

    let commit_url = git.getCommitUrl(
      url.getUsername(),
      url.getRepo(),
      commit_id,
    );
    commit_id = commit_id.substr(0, 7);

    if (null == started_at) {
      started_at = 'Pending';
    } else {
      let d;
      d = new Date(parseInt(started_at) * 1000);
      started_at = d.toLocaleString();
    }

    let stopped_time;
    let stopped_title;
    let stopped_string;

    if (null == stopped_at || '0' === stopped_at) {
      stopped_string = build_status;
    } else {
      stopped_string = formatTime(stopped_at);

      stopped_time = new Date(parseInt(stopped_at) * 1000);
      stopped_title = 'Finished ' + stopped_time.toLocaleString();
    }

    let li_el = $('<li class="builds_list_item"></li>');

    let status_color;

    let {
      handle: button_handle,
      title: button_title,
    } = common_status.getButton(build_status);
    status_color = common_status.getColor(build_status);
    build_status = common_status.change(build_status);
    let build_status_icon = common_status.getIcon(build_status);
    // const className = common_status.getClassName(build_status);

    li_el.append(
      $('<div class="build_id"></div>').css({
        background: status_color,
        border: '1px solid' + status_color,
      }),
    );

    li_el
      // .addClass(className)
      .attr({
        'data-id': build_id,
      })
      .append($('<div class="event_type"></div>').append(build_status_icon))
      .append(
        $('<div class="branch text-truncate"></div>')
          .append(event_type === 'tag' ? tag_icon : branch_icon)
          .append(event_type === 'tag' ? tag : branch.slice(0, 10))
          .attr('title', branch)
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
        $('<div class="commit_message text-truncate"></div>')
          .append(commit_message_icon + '&nbsp' + commit_message.slice(0, 40))
          .attr('title', commit_message),
      )
      .append(
        $('<a class="commit_id"> </a>')
          .append(commit_icon + commit_id)
          .attr({
            href: commit_url,
            title: 'View commit on GitHub',
            target: '_block',
          })
          .addClass('commit_url'),
      )
      .append(
        $('<a class="build_status"></a>')
          .append($('<strong></strong>').append(`#${build_id} ${build_status}`))
          .attr({
            href: `${location.href}/${build_id}`,
            target: '_self',
          })
          .css('color', status_color),
      )
      .append(
        $('<div class="build_time"> </div>')
          .append(clock_icon)
          .append(total_time),
      )
      .append(
        $('<div> </div>')
          .append(time_ago_icon)
          .append(stopped_string)
          .addClass('build_time_ago')
          .attr('title', stopped_title),
      )
      .append(
        $('<button class="cancel_or_restart"></button>')
          .append(button_handle === 'cancel' ? cancel_icon : refresh_icon)
          .attr({
            title: button_title + ' build',
            event_id: build_id,
            job_or_build: 'build',
            handle: button_handle,
          })
          .addClass('btn btn-link'),
      );

    li_el.css({ display: 'none' });

    ul_el.append(li_el);
  });

  if (append) {
    $('.builds_list_item').fadeIn(500);
    return;
  }

  display_element.append(ul_el).append(
    $(
      '<button class="builds_list_more btn btn-outline-secondary" type="button">More</button>',
    ).attr({
      'data-toggle': 'tooltip',
      'data-placement': 'bottom',
      title: '点击加载更多',
    }),
  );

  $('.builds_list_item').fadeIn(500);

  // 按钮点击事件 already move to main.js
  // $('.builds_list button').on({
  //   'click': function () {
  //     common_status.buttonClick($(this));
  //   }
  // })
}

export default {
  showBuildNav,
  handle: (url) => {
    let build_id;
    let url_array = url.getUrlWithArray();
    let display_element = $('#display');

    if (6 === url_array.length) {
      build_id = url_array[5];
    } else {
      // build history
      column_span_click('builds');
    }

    // TODO: loading
    display_element.empty().append(`
<div class="spinner-grow text-secondary" role="status">
  <span class="sr-only"></span>
</div>
`);

    // build detail // end
    if (build_id) {
      (async () => {
        try {
          let result = await pcit_builds.find(build_id);
          display(result, url);
        } catch (e) {
          build_not_find(
            "Oops, we couldn't find that build!",
            '',
            'The build may not exist or may belong to another repository.',
          );
        }
      })();

      return;
    }

    // build history
    (async () => {
      try {
        let result = await pcit_builds.findByRepo(
          url.getGitType(),
          url.getRepoFullName(),
        );
        display(result, url);
      } catch (e) {
        console.log(e);
        display_element.empty();
        display_element
          .hide()
          .append(build_not_find('Not Build Yet !', '', ''))
          .fadeIn(500);
      }
    })();

    // $.ajax({
    //   type: 'GET',
    //   url: '/api/repo/' + url.getGitRepoFullName() + '/builds',
    //   success: function(data) {
    //     display(data, url);
    //   },
    //   error: function(data) {
    //     display_element.empty();
    //     display_element.append(build_not_find('Not Build Yet !', '', ''));
    //     // console.log(data);
    //   },
    // });
  },

  more(url, before, request = true) {
    (async () => {
      let result = request
        ? await pcit_builds.findByRepo(
            url.getGitType(),
            url.getRepoFullName(),
            undefined,
            false,
            before,
          )
        : [];

      if (JSON.stringify(result) === '[]') {
        alert('没有了哦');
        $('.builds_list_more')
          .attr({
            disabled: 'true',
            title: '没有了哦',
            'data-toggle': 'tooltip',
            'data-placement': 'bottom',
          })
          .removeClass('btn-success')
          // .addClass('btn-outline-dark')
          .addClass('btn-light')
          .text('没有了哦');
        return;
      }

      // console.log(result);
      display(result, url, true);
    })();
  },
};
