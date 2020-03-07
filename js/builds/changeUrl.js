// http://www.zhangxinxu.com/wordpress/2013/06/html5-history-api-pushstate-replacestate-ajax/
// https://developer.mozilla.org/zh-CN/docs/Web/API/History_API
// 标题参数目前无效

import url from './url';

const changeUrl = (id, replace = false) => {
  if ('trigger_build' === id) {
    return;
  }

  if ('current' === id) {
    if (replace) {
      history.replaceState({ key_id: id }, null, url.getRepoFullNameUrl());
      return;
    }

    history.pushState({ key_id: id }, null, url.getRepoFullNameUrl());
  } else {
    if (replace) {
      if (6 === url.getUrlWithArray().length) {
        history.replaceState({ key_id: id }, null, null);

        return;
      }

      history.replaceState(
        { key_id: id },
        null,
        url.getRepoFullNameUrl() + '/' + id,
      );

      return;
    } // replace end

    history.pushState(
      { key_id: id },
      null,
      url.getRepoFullNameUrl() + '/' + id,
    );
  }
};

export default changeUrl;
