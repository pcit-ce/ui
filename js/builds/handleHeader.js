const pcit = require('@pcit/pcit-js');

module.exports = function handleHeader(token, gitType = 'github') {
  if (!token) {
    $('header .userHeader').hide();
    $('header .login').show();
    return;
  }

  $('header .login').hide();

  new pcit.User(token, '/api').current().then(res => {
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
};
