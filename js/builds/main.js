import '../../css/builds.css';

const header = require('../common/header');
const footer = require('../common/footer');
import url from './url';

const common = require('./common');
const token = require('../common/token');

import navClick from './navClick';
// const changeUrl = require('./changeUrl');
import showRepoTitle from './showRepoTitle';
import headerHandler from './headerHandler';

header.show();
footer.show();

headerHandler(token.getToken(url.getGitType()), url.getGitType());

require('./on');

// https://www.cnblogs.com/yangzhi/p/3576520.html
$('.column .main').on({
  // 导航栏点击事件
  click() {
    let el = $(this);
    let id = el[0].id;

    // console.log(id);
    if (-1 === $.inArray(id, ['buildNav', 'jobNav'])) {
      navClick(id);
    }

    common.column_remove(); // 移除其他
    common.column_click_handle(id); // 点击的执行逻辑
  },
  mouseover() {
    common.mouseoverMethod($(this));
  },
  mouseout() {
    common.mouseoutMethod($(this));
  },
});

// 处理页面加载，用户首次进入
$(() => {});

// =

$(document).ready(() => {});

// =

jQuery(document).ready(function() {
  // console.log('ready');

  let type = url.getType();

  showRepoTitle();

  if (url.getUrlWithArray().length === 8) {
    type =
      url.getUrlWithArray().slice(-2)[0] === 'builds' ? 'buildNav' : 'jobNav';
  }

  // console.log(type);

  common.column_remove(); // 移除其他 nav
  navClick(type, false); // 渲染 display 页面

  if (url.getUrlWithArray().length === 5) {
    // repo 页面
    return;
  }

  common.column_click_handle(type); // 渲染被点击的 column
  // changeUrl(type, true);
});

// 游客模式 隐藏部分按钮
if (!token.getToken(url.getGitType())) {
  $('.more_options .auth').remove();
}

// 处理回退事件
window.onpopstate = event => {
  let id = event.state.key_id;
  // console.log(id);

  navClick(id, false); // 渲染 display 页面
  common.column_remove(); // 移除 column
  common.column_click_handle(id); // 渲染被点击的 column
};
