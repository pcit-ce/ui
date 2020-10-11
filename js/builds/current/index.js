import pcit from '@pcit/pcit-js';

const { column_span_click } = require('../common');

import build from '../builds';
const error_info = require('../error/error').error_info;

function display(data, url) {
  let display_element = $('#display');

  display_element.empty();

  if (0 === data.length) {
    display_element.hide().append(error_info('Not Build Yet !')).fadeIn(500);
    // display_element.innerHeight(55);
  } else {
    build.show(data, url);
  }
}

export default {
  handle: (url) => {
    // TODO: loading
    $('#display').empty().append(`
<div class="spinner-grow text-secondary" role="status">
  <span class="sr-only"></span>
</div>
`);

    column_span_click('current');

    const builds = new pcit('', '').builds;

    (async () => {
      try {
        let result = await builds.current(
          url.getGitType(),
          url.getRepoFullName(),
        );

        display(result, url);
      } catch (e) {
        console.log(e);
        display('', url);
      }
    })();

    // $.ajax({
    //   type: 'GET',
    //   url: '/api/repo/' + url.getGitRepoFullName() + '/build/current',
    //   success: function(data) {
    //     display(data, url);
    //   },
    //   error: function() {
    //     display('', url);
    //   },
    // });
  },
};
