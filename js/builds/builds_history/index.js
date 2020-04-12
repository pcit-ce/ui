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
      committer_username,
      commit_message,
      commit_id,
      build_status,
      started_at,
      finished_at: stopped_at,
      tag,
    } = status;

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

    if (null == stopped_at) {
      stopped_string = 'Pending';
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
        $(
          '<div class="commit_message text-truncate"><svg t="1583509372477" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="39924" width="20" height="20"><path d="M863.573333 102.4 160.426667 102.4C109.226667 102.4 68.266667 143.36 68.266667 197.973333l0 508.586667c0 51.2 40.96 95.573333 92.16 95.573333l191.146667 0c6.826667 0 13.653333 3.413333 17.066667 6.826667l75.093333 81.92c17.066667 20.48 40.96 30.72 68.266667 30.72s51.2-10.24 68.266667-30.72l75.093333-81.92c3.413333-6.826667 10.24-6.826667 17.066667-6.826667l191.146667 0c51.2 0 92.16-40.96 92.16-95.573333L955.733333 197.973333C955.733333 143.36 914.773333 102.4 863.573333 102.4zM887.466667 706.56c0 13.653333-10.24 27.306667-23.893333 27.306667l-191.146667 0c-27.306667 0-51.2 10.24-68.266667 30.72l-75.093333 81.92c-10.24 10.24-27.306667 10.24-34.133333 0l-75.093333-81.92c-17.066667-20.48-40.96-30.72-68.266667-30.72L160.426667 733.866667c-13.653333 0-23.893333-10.24-23.893333-27.306667L136.533333 197.973333C136.533333 180.906667 146.773333 170.666667 160.426667 170.666667l703.146667 0C877.226667 170.666667 887.466667 180.906667 887.466667 197.973333L887.466667 706.56z" p-id="39925" fill="#666666"></path><path d="M508.586667 436.906667m-61.44 0a1.8 1.8 0 1 0 122.88 0 1.8 1.8 0 1 0-122.88 0Z" p-id="39926" fill="#666666"></path><path d="M720.213333 436.906667m-61.44 0a1.8 1.8 0 1 0 122.88 0 1.8 1.8 0 1 0-122.88 0Z" p-id="39927" fill="#666666"></path><path d="M300.373333 436.906667m-61.44 0a1.8 1.8 0 1 0 122.88 0 1.8 1.8 0 1 0-122.88 0Z" p-id="39928" fill="#666666"></path></svg> </div>',
        )
          .append(commit_message.slice(0, 40))
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
        $(
          '<div class="build_time"><i class="material-icons md-16">alarm_on</i> </div>',
        ).append(started_at),
      )
      .append(
        $('<div><i class="material-icons md-16">event_note</i> </div>')
          .append(stopped_string)
          .addClass('build_time_ago')
          .attr('title', stopped_title),
      )
      .append(
        $('<button class="cancel_or_restart"></button>')
          .append(
            $('<i class="material-icons"></i>').append(
              button_handle === 'cancel' ? 'highlight_off' : 'refresh',
            ),
          )
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
      column_span_click('builds');
    }

    if (build_id) {
      // $.ajax({
      //   type: 'GET',
      //   url: '/api/build/' + build_id,
      //   success: function(data) {
      //     display(data, url);
      //   },
      //   error: function(data) {
      //     build_not_find(
      //       "Oops, we couldn't find that build!",
      //       '',
      //       'The build may not exist or may belong to another repository.',
      //     );
      //     // console.log(data);
      //   },
      // });

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

    // 加载中，动画 TODO

    // display_element.empty().append('加载中...');

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
        alert('没有了呢');
        $('.builds_list_more')
          .attr({
            disabled: 'true',
            title: '没有了呢',
            'data-toggle': 'tooltip',
            'data-placement': 'bottom',
          })
          .removeClass('btn-success')
          // .addClass('btn-outline-dark')
          .addClass('btn-light')
          .text('没有了呢');
        return;
      }

      // console.log(result);
      display(result, url, true);
    })();
  },
};
