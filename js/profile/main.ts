'use strict';

import '../../css/profile.css';
const header = require('../common/header');
const footer = require('../common/footer');
const git = require('../common/git');
const app = require('../common/app');
const title = require('../common/title');

const ClipboardJS = require('clipboard');
const Cookies = require('js-cookie');
import headerHandler from '../builds/headerHandler';
let url_array = location.href.split('/');
let git_type = url_array[4];
// eslint-disable-next-line no-undef
let token = Cookies.get(git_type + '_api_token');

header.show();
footer.show();

headerHandler(token, git_type);

let ci_host = 'https://' + location.host + '/';
let username = url_array[5];

import pcit from '@pcit/pcit-js';
const pcit_system = new pcit(token, '').system;
const pcit_user = new pcit(token, '').user;
const pcit_repo = new pcit(token, '').repo;
const pcit_org = new pcit(token, '').org;

function settings(data: any) {
  let { username, type } = data;

  $('#username')
    .html(
      '<svg t="1583493717526" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2155" width="24" height="24"><path d="M518.1 107c-124.3 0-225 100.7-225 225 0 69.3 31.3 131.3 80.6 172.5C225.1 563 120 707.7 120 877c0 22.1 17.9 40 40 40s40-17.9 40-40c0-43.2 8.4-85.1 25.1-124.5 16.1-38.1 39.2-72.3 68.6-101.7s63.6-52.5 101.7-68.6c38.3-16.2 79.1-24.6 121.1-25.1h1.6c124.3 0 225-100.7 225-225S642.4 107 518.1 107z m102.5 327.6c-26.7 26.7-62 41.7-99.6 42.4H515.3c-37.7-0.7-73-15.7-99.8-42.4-27.4-27.4-42.5-63.8-42.5-102.5s15.1-75.1 42.5-102.5C443 202.1 479.4 187 518.1 187s75.1 15.1 102.5 42.5 42.5 63.8 42.5 102.5c0 38.8-15.1 75.2-42.5 102.6z" fill="#4A5FE2" p-id="2156"></path><path d="M798 605.8c-7.3-8.3-18-13.5-30-13.5-22.1 0-40 17.9-40 40 0 10.4 4 19.9 10.5 27 25.5 27.4 45.8 58.7 60.4 93.2C815.6 791.8 824 833.7 824 877c0 22.1 17.9 40 40 40s40-17.9 40-40c0-104.7-40.2-199.9-106-271.2z" fill="#7C44E2" p-id="2157"></path></svg> ' +
        username,
    )
    .addClass(type);

  let titleContent = `${git.format(git_type)} - ${username} - Profile - ${
    app.app_name
  }`;

  title.titleChange(titleContent);

  $('#user')
    .empty()
    .append(() => $('<span></span>').append(username))
    .append(() => $('<strong></strong>').append('API authentication'))
    .append(() =>
      $('<p></p>')
        .append('使用 PCIT API 请访问')
        .append(
          $('<a></a>').append('https://docs.ci.khs1994.com/api/').attr({
            href: 'https://docs.ci.khs1994.com/api/',
            target: '_blank',
          }),
        )
        .append(() =>
          $('<input/>').attr({
            id: 'token',
            value: token,
          }),
        )
        .append(() =>
          $('<button></button>')
            .addClass('copy_token')
            .attr({
              'data-clipboard-target': '#token',
            })
            .append('Copy'),
        ),
    );
}

$('.copy_token').on({
  click: () => {
    copyToken();
  },
});

function copyToken() {
  // eslint-disable-next-line no-undef
  let clipboard = new ClipboardJS('.copy_token');

  clipboard.on('success', function (e: any) {
    console.info('Action:', e.action);
    console.info('Text:', e.text);
    console.info('Trigger:', e.trigger);

    e.clearSelection();
  });
}

// show repos
function list_repos(reposData: any) {
  let repos_element = $('#repos');

  repos_element.empty();

  let reposArr: any[] = [];

  for (let repo of reposData) {
    repo.build_id ? reposArr.unshift(repo) : reposArr.push(repo);
  }

  $.each(reposArr, function (num: number, repo: any) {
    let repo_item_el = $('<div class="repo_item row"></div>');
    let { webhooks_status: status, repo_full_name: repo_name } = repo;

    // <p id="username/repo">username/repo</p>
    let p = $('<a class="repo_full_name col-12 col-md-8"></a>')
      .text(repo_name)
      .attr({
        repo_name: repo_name,
        href: ci_host + git_type + '/' + repo_name,
        target: '_blank',
      })
      .css('display', 'inline');

    let button = $('<i class="toggle col-6 col-md-2 material-icons"></i>')
      .addClass('open_or_close btn btn-link btn-sm')
      .attr('repo_name', repo_name);

    if (status === 1 + '') {
      button
        .text('toggle_on')
        .attr('title', 'disable')
        .css('color', 'rgb(3,102,214)');
    } else {
      button.text('toggle_off').attr('title', 'activate');
    }

    let settings = $(
      '<a class="settings"><svg t="1583494568094" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2549" width="24" height="24"><path d="M642.8 165.6c3.5 0 6.8 0.9 9.9 2.7l86.6 50c5.9 3.4 8.3 8.5 9.3 12.1 1 3.7 1.4 9.2-2 15.2l-21.4 37.1c-15.3 26.4-14.2 59.2 2.9 84.6 6.4 9.5 12.2 19.6 17.4 30 13.5 27.3 41.3 44.7 71.8 44.7H860c11 0 20 9 20 20v100c0 11-9 20-20 20h-42.8c-30.5 0-58.3 17.3-71.8 44.7-5.1 10.4-11 20.5-17.4 30-17 25.3-18.1 58.2-2.9 84.6l21.4 37.1c5.5 9.6 2.2 21.8-7.3 27.3l-86.6 50c-3.1 1.8-6.4 2.7-9.9 2.7-2.7 0-12-0.7-17.4-10l-21.4-37.1a79.95 79.95 0 0 0-69.3-40c-1.7 0-3.5 0.1-5.3 0.2-6 0.4-11.9 0.6-17.4 0.6-5.5 0-11.4-0.2-17.4-0.6-1.8-0.1-3.5-0.2-5.3-0.2-28.4 0-54.9 15.1-69.3 40l-21.4 37.1c-5.4 9.3-14.7 10-17.4 10-3.5 0-6.8-0.9-9.9-2.7l-86.6-50c-9.6-5.5-12.8-17.8-7.3-27.3l21.4-37.1c15.3-26.4 14.2-59.2-2.9-84.6-6.4-9.5-12.2-19.6-17.4-30-13.5-27.3-41.3-44.7-71.8-44.7H164c-11 0-20-9-20-20V462c0-11 9-20 20-20h42.8c30.5 0 58.3-17.3 71.8-44.7 5.1-10.4 11-20.5 17.4-30 17-25.3 18.1-58.2 2.9-84.6l-21.4-37.1c-3.4-5.9-3-11.5-2-15.2 1-3.7 3.4-8.7 9.3-12.1l86.6-50c3.1-1.8 6.4-2.7 9.9-2.7 2.7 0 12.1 0.7 17.4 10l21.4 37.1c14.4 24.9 40.8 40 69.3 40 1.7 0 3.5-0.1 5.3-0.2 6-0.4 11.9-0.6 17.4-0.6 5.5 0 11.4 0.2 17.4 0.6 1.8 0.1 3.5 0.2 5.3 0.2 28.4 0 54.9-15.1 69.3-40l21.4-37.1c5.2-9.3 14.6-10 17.3-10m0-80c-34.6 0-68.2 17.9-86.7 50l-21.4 37.1c-7.5-0.5-15-0.8-22.7-0.8-7.6 0-15.2 0.3-22.6 0.8L468 135.6c-18.5-32.1-52.1-50-86.7-50-17 0-34.2 4.3-49.9 13.4l-86.6 50c-47.8 27.6-64.2 88.8-36.6 136.6l21.4 37.1c-8.4 12.5-16 25.6-22.7 39.3H164c-55.2 0-100 44.8-100 100v100c0 55.2 44.8 100 100 100h42.8c6.7 13.6 14.3 26.7 22.7 39.3l-21.4 37.1c-27.6 47.8-11.2 109 36.6 136.6l86.6 50c15.7 9.1 32.9 13.4 49.9 13.4 34.6 0 68.2-17.9 86.7-50l21.4-37.1c7.5 0.5 15 0.8 22.6 0.8 7.6 0 15.2-0.3 22.7-0.8l21.4 37.1c18.5 32.1 52.1 50 86.7 50 17 0 34.2-4.3 49.9-13.4l86.6-50c47.8-27.6 64.2-88.8 36.6-136.6l-21.4-37.1c8.4-12.5 16-25.6 22.7-39.3H860c55.2 0 100-44.8 100-100V462c0-55.2-44.8-100-100-100h-42.8c-6.7-13.6-14.3-26.7-22.7-39.3l21.4-37.1c27.6-47.8 11.2-109-36.6-136.6l-86.6-50c-15.7-9.1-32.9-13.4-49.9-13.4z" fill="#4a5fe2" p-id="2550"></path><path d="M512 442c38.6 0 70 31.4 70 70s-31.4 70-70 70-70-31.4-70-70 31.4-70 70-70m0-80c-82.8 0-150 67.2-150 150s67.2 150 150 150 150-67.2 150-150-67.2-150-150-150z" fill="#7c44e2" p-id="2551"></path></svg></a>',
    )
      .attr('href', ci_host + [git_type, repo_name, 'settings'].join('/'))
      .attr('target', '_blank')
      .attr('title', 'open repo setting');

    // console.log('github' === git_type);

    repo_item_el
      .append(p)
      .append(() => {
        return 'github' === git_type ? '' : button;
      })
      .append(settings);

    repo_item_el.css({
      display: 'none',
    });

    repos_element.append(repo_item_el);
  });

  $('.repo_item').fadeIn(500);
}

// show org list
function showOrg(data: any) {
  $.each(data, (num: number, org: any) => {
    let { username: org_name } = org;

    $('.orgs').append(
      $('<p class="org_name"></p>')
        .append(
          '<svg t="1583494335326" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2400" width="24" height="24"><path d="M392.5 517.4c104.9 0 190-85.1 190-190s-85.1-190-190-190-190 85.1-190 190 85.1 190 190 190z m-77.8-267.8c20.8-20.7 48.4-32.2 77.8-32.2s57 11.4 77.8 32.2 32.2 48.4 32.2 77.8-11.4 57-32.2 77.8c-20.8 20.8-48.4 32.2-77.8 32.2s-57-11.4-77.8-32.2c-20.8-20.8-32.2-48.4-32.2-77.8s11.4-57 32.2-77.8zM492.5 562.6h-200c-110 0-200 90-200 200v84c0 22.1 17.9 40 40 40s40-17.9 40-40v-84c0-31.8 12.5-61.9 35.3-84.7 22.8-22.8 52.8-35.3 84.7-35.3h200c31.8 0 61.9 12.5 84.7 35.3s35.3 52.8 35.3 84.7v84c0 22.1 17.9 40 40 40s40-17.9 40-40v-84c0-110-90-200-200-200z" fill="#4a5fe2" p-id="2401"></path><path d="M731.5 562.6h-0.3c-22.1 0-40 17.9-40 40s17.9 40 40 40h0.3c31.8 0 61.9 12.5 84.7 35.3s35.3 52.8 35.3 84.7v84c0 22.1 17.9 40 40 40s40-17.9 40-40v-84c0-110-90-200-200-200zM851.4 327.4c0-104.9-85.1-190-190-190-22.1 0-40 17.9-40 40s17.9 40 40 40c29.4 0 57 11.4 77.8 32.2s32.2 48.4 32.2 77.8-11.4 57-32.2 77.8c-20.8 20.8-48.4 32.2-77.8 32.2-22.1 0-40 17.9-40 40s17.9 40 40 40c104.9 0 190-85.1 190-190z" fill="#7c44e2" p-id="2402"></path></svg> ' +
            org_name,
        )
        .attr({
          org_name: org_name,
        }),
    );
  });

  (async () => {
    let oauth_url = await pcit_system.getOauthClientId();

    $('#miss_org').append(
      $('<p class="org_tips">找不到组织?请点击 </p>').append(
        $('<a></a>').append('授权').attr({
          href: oauth_url.url,
          target: '_black',
        }),
      ),
    );
  })();
}

function showGitHubAppSettings(org_name: string, installation_id: number) {
  (async () => {
    // let settings_url = await new Promise(resolve => {
    //   $.ajax({
    //     type: 'GET',
    //     url: '/api/ci/github_app_settings/' + org_name,
    //     success(data) {
    //       resolve(data);
    //     },
    //   });
    // });

    let result = await pcit_system.getGitHubAppSettingsAddress(org_name);

    let settings_url = result.url;

    $('#repos').append(() => {
      return $('<p class="repo_tips"></p>')
        .append('找不到仓库？请在 ')
        .append(() => {
          return $('<a></a>')
            .attr({
              href: `${settings_url}/${installation_id}`,
              target: '_blank',
            })
            .text('GitHub');
        })
        .append(' 添加仓库')
        .css({
          display: 'none',
        });
    });

    $('.repo_tips').fadeIn(500);
  })();
}

function showGitHubAppInstall(uid: number) {
  (async () => {
    // let installation_url = await new Promise(resolve => {
    //   $.ajax({
    //     type: 'GET',
    //     url: '/api/ci/github_app_installation/' + uid,
    //     success: function(data) {
    //       resolve(data);
    //     },
    //   });
    // });

    let result = await pcit_system.getGitHubAppInstallationAddress(uid);

    let installation_url = result.url;

    $('#repos')
      .append(
        $('<div class="card border-primary text-center repo_tips"></div>')
          .append(
            $('<div class="card-header"></div>').append(
              '此账号或组织未安装 GitHub App',
            ),
          )
          .append(
            $('<div class="card-body text-primary"></div>')
              .append($('<h5 class="card-title"></h5>'))
              .append(
                $('<p class="card-text"></p>').append(
                  '使用 PCIT 之前请先安装 GitHub App',
                ),
              )
              .append(
                $('<a class="btn btn-outline-primary">立即安装</a>').attr({
                  href: installation_url,
                  target: '_blank',
                }),
              ),
          ),
      )
      .css({
        display: 'none',
      });

    $('#repos').fadeIn(500);
  })();
}

function get_userdata(): any {
  // return new Promise(resolve => {
  //   $.ajax({
  //     type: 'GET',
  //     url: '/api/user',
  //     headers: {
  //       Authorization: 'token ' + token,
  //     },
  //     success: function(data) {
  //       resolve(data);
  //     },
  //   });
  // });

  return pcit_user.current();
}

function click_user() {
  $('#orgs .org_name').css({ 'background-color': 'white', color: '#666' });

  $('#username').css({
    'background-color': '#f4f9f9',
    color: 'rgb(3, 102, 214)',
  });
  (async () => {
    let data = await get_userdata();

    let { installation_id, uid, username, name, pic } = data;

    let repo_data = await get_user_repos();

    history.pushState(
      {},
      username,
      ci_host + 'profile/' + git_type + '/' + username,
    );

    $('.header_img').attr('src', pic ? pic : '/ico/pcit.png');
    $('.details_usernickname').text(name ? name : username);
    $('.details_username').text('@' + username);

    list_repos(repo_data);

    if (git_type !== 'github') {
      return;
    }

    parseInt(installation_id)
      ? showGitHubAppSettings(null, installation_id)
      : showGitHubAppInstall(uid);
  })();
}

function show_org(data: any, org_name: string) {
  if (data === undefined) {
    return;
  }

  let { pic, username, name } = data;

  $('.header_img').attr('src', pic ? pic : '/ico/pcit.png');
  $('.details_usernickname').text(name ? name : username);
  $('.details_username').text('@' + username);

  $('.userbasicInfo').fadeIn(500);

  let { installation_id, uid } = data;

  (async () => {
    // let org_data = await new Promise(resolve => {
    //   $.ajax({
    //     type: 'GET',
    //     url: '/api/repos/' + git_type + '/' + org_name,
    //     headers: {
    //       Authorization: 'token ' + token,
    //     },
    //     success: function(data) {
    //       resolve(data);
    //     },
    //   });
    // });

    let org_data = await pcit_repo.listByOwner(git_type, org_name);

    history.pushState(
      {},
      org_name,
      ci_host + 'profile/' + git_type + '/' + org_name,
    );

    list_repos(org_data);

    if (git_type !== 'github') {
      return;
    }

    parseInt(installation_id)
      ? showGitHubAppSettings(org_name, installation_id)
      : showGitHubAppInstall(uid);
  })();
}

function click_org(org_name: string) {
  // $.ajax({
  //   type: 'GET',
  //   url: '/api/org/' + git_type + '/' + org_name,
  //   headers: {
  //     Authorization: 'token ' + token,
  //   },
  //   success: function(data) {
  //     show_org(data, org_name);
  //   },
  // });

  (async () => {
    let result = await pcit_user.find(git_type, org_name);

    show_org(result, org_name);
  })();
}

function get_user_repos() {
  // return new Promise(resolve => {
  //   $.ajax({
  //     type: 'GET',
  //     url: '/api/repos',
  //     headers: {
  //       Authorization: 'token ' + token,
  //     },
  //     success: function(data) {
  //       resolve(data);
  //     },
  //   });
  // });

  return pcit_repo.list();
}

$(document).ready(function () {
  (async () => {
    let data = await get_userdata();

    settings(data);

    let { installation_id, username: api_username, uid } = data;

    if (api_username === username) {
      // $.ajax({
      //   type: 'GET',
      //   url: '/api/orgs',
      //   headers: {
      //     Authorization: 'token ' + token,
      //   },
      //
      //   success: function(data) {
      //     showOrg(data);
      //   },
      // });

      (async () => {
        let result = await pcit_org.list();

        showOrg(result);
      })();
    }

    click_user();

    if ('github' === git_type) {
      parseInt(installation_id)
        ? showGitHubAppSettings(username, installation_id)
        : showGitHubAppInstall(uid);
      return;
    }

    // let oauth_client_url = await new Promise(resolve => {
    //   $.ajax({
    //     type: 'GET',
    //     url: '/api/ci/oauth_client_id',
    //     headers: {
    //       Authorization: 'token ' + token,
    //     },
    //     success: function(data) {
    //       resolve(data);
    //     },
    //   });
    // });

    let result = await pcit_system.getOauthClientId();

    let oauth_client_url = result.url;

    $('.tip').after(
      $('<p></p>').append(
        $('<a></a>').append('<button>授权</button>').attr({
          href: oauth_client_url,
          target: '_blank',
        }),
      ),
    );
  })();
});

$('#sync').on('click', function () {
  $(this).empty().append('账户信息同步中').attr('disabled', 'disabled');

  $(this).after(
    $('<div></div>')
      .addClass('progress')
      .append(
        $('<div></div>')
          .addClass('progress-bar progress-bar-striped progress-bar-animated')
          .attr({
            role: 'progressbar',
            'aria-valuenow': 10,
            'aria-valuemin': 0,
            'aria-valuemax': 100,
          })
          .css('width', '20%'),
      ),
  );

  function progress(progress: number, timeout: number) {
    setTimeout(() => {
      $('.progress-bar')
        .attr('aria-valuenow', progress)
        .css('width', progress + '%');
    }, timeout);
  }

  // $.ajax({
  //   type: 'POST',
  //   url: '/api/user/sync',
  //   headers: {
  //     Authorization: 'token ' + token,
  //   },
  //   success: function(data) {
  //     location.reload();
  //     // console.log(data);
  //   },
  // });

  (async () => {
    let result = await pcit_user.sync();
    location.reload();
  })();

  progress(20, 2000);
  progress(40, 10000);
  progress(80, 15000);
  progress(97, 30000);
});

$(document).on('click', '.org_name', function () {
  $('#username').css({ 'background-color': 'white', color: '#666' });

  $('#orgs .org_name').css({ 'background-color': 'white', color: '#666' });

  // $('#orgs .org_name').hover(()=>{
  //   $('#orgs .org_name').css({color: '#0366d6'})
  // },()=>{
  //   $('#orgs .org_name').css({color: '#666'})
  // });

  $(this).css({ 'background-color': '#f4f9f9', color: 'rgb(3, 102, 214)' });
  click_org($(this).attr('org_name'));
});

$('#userinfo').click(function (event) {
  let username = event.target.innerHTML;
  click_user();
});

// append 添加元素绑定事件
// https://www.cnblogs.com/liubaojing/p/8383960.html
$('#repos').on('click', '.open_or_close', function () {
  let status = $(this).text();
  let repo = $(this).attr('repo_name');
  let that = $(this);

  if ('toggle_on' === status) {
    $.ajax({
      type: 'DELETE',
      url: ci_host + 'webhooks/' + git_type + '/' + repo + '/deactivate',
      dataType: 'json',
      contentType: 'application/json;charset=utf-8',
      success(data) {
        that.text('toggle_off').css('color', 'black').attr('title', 'activate');
        // console.log(data);
      },
    });
  } else {
    $.ajax({
      type: 'POST',
      url: ci_host + 'webhooks/' + git_type + '/' + repo + '/activate',
      success(data) {
        that
          .text('toggle_on')
          .css('color', 'rgb(3,102,214)')
          .attr('title', 'disable');
        // console.log(data);
      },
    });
  }
});
