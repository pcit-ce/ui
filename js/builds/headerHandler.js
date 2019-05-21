import pcit from '@pcit/pcit-js';
const git = require('../common/git');

export default function headerHandler(token, gitType = 'github') {
  if (!token) {
    $('header .userHeader').hide();
    $('header .login').show();
    return;
  }

  $('header .login').hide();
  $('header .gitType').append(git.format(gitType));

  new pcit(token, '/api').user.current().then(res => {
    let { username, pic } = res[0];

    $('header .profile').attr({
      href: location.origin + '/profile/' + gitType + '/' + username,
    });

    $('header .rounded').attr({
      src: pic,
    });

    $('header .username').append(username);

    $('header .logout').attr({
      href: location.origin + '/' + gitType + '/logout',
    });
  });

  $('header .userHeader').show();
}
