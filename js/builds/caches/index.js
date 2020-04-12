import pcit from '@pcit/pcit-js';

const error_info = require('../error/error').error_info;
const delete_icon = require('../../icon/delete');

function display(data) {
  let display_element = $('#display');

  display_element.empty().hide();

  if (JSON.stringify(data) === '[]') {
    display_element
      .append(
        error_info(
          'No caches have been created yet, please read docs https://docs.ci.khs1994.com/usage/cache.html',
        ),
      )
      .fadeIn(1500);

    return;
  }

  let cache_list_group = $('<ul class="list-group cache-list"></ul>');

  for (const branch in data) {
    if (data.hasOwnProperty(branch)) {
      const element = data[branch];
      cache_list_group.append(`
<li class="list-group-item cache-list-item">
  <div class="container">
  <div class="row">
  <div class="col-4 col-sm-4 col-md-4 cache-branch">
    ${branch}
  </div>

  <div class="col-3 col-sm-4 col-md-4 cache-last-update">
    10 years ago
  </div>

  <div class="col-3 col-sm-3 col-md-3 cache-size">
    ${element.size.toFixed(2)} MB
  </div>

  <div class="col-2 col-sm-1 col-md-1 cache-delete">
    <div data-branch="${branch}" class="delete-btn" style="float:right">
      <button type="button" class="btn btn-link">${delete_icon}</button>
    </div>
  </div>
  </div>
  </div>
</li>
    `);
    }
  }

  display_element.append(cache_list_group).fadeIn(1500);
  // .innerHeight(55);
}

export default {
  handle: (url, token) => {
    // console.log(location.href);
    // $.ajax({
    //   type: 'get',
    //   url: '/api/repo/' + url.getRepoFullName() + '/caches',
    //   headers: {
    //     Authorization: 'token ' + token.getToken(url.getGitType()),
    //   },
    //   success: function(data) {
    //     display(data);
    //   },
    // });

    const pcit_repo = new pcit(token.getToken(url.getGitType()), '').repo;

    (async () => {
      let result = await pcit_repo.caches.list(url.getRepoFullName());

      display(result);
    })();
  },
};
