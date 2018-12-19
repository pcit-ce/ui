const git = require('../common/git');
const title = require('./title');
const url = require('./url');

const showRepoTitle = () => {
  let content = jQuery('<h1 class="repo_title"></h1>');

  let type = url.getType();

  title.show(url.getBaseTitle(), type);

  content
    .append(() => {
      return $('<a class="h1_git_type"></a>')
        .append(() => {
          let git_format = git.format(url.getGitType());
          return $('<div></div>')
            .append(git_format)
            .css('float', 'left')
            .attr('title', 'View Repository on ' + git_format);
        })
        .attr({
          href: [
            git.getUrl(url.getUsername(), url.getRepo(), url.getGitType()),
            url.getUsername(),
            url.getRepo(),
          ].join('/'),
          target: '_block',
        })
        .css({
          display: 'block',
        })
        .append(
          $('<span></span>')
            .addClass('badge badge-dark badge-pill')
            .append('Beta')
            .css({
              'font-size': '11px',
              display: 'block',
              float: 'left',
              'margin-right': '10px',
            }),
        );
    })
    .append(
      $('<a class="h1_username">')
        .append(url.getUsername())
        .attr({
          href: [url.getHost(), url.getGitType(), url.getUsername()].join('/'),
        }),
    )
    .append($('<span></span>').append(' / '))
    .append(() => {
      return $('<a class="h1_repo"></a>')
        .append(url.getRepo())
        .attr(
          'href',
          [
            url.getHost(),
            url.getGitType(),
            url.getUsername(),
            url.getRepo(),
          ].join('/'),
        );
    })
    .append(() => {
      let a_element = $('<a class="h1_status"></a>');
      let img_element = $('<img src=""/>');

      img_element.attr('src', url.getRepoFullNameUrl() + '/status');
      return a_element
        .append(img_element)
        .attr('href', url.getRepoFullNameUrl() + '/getstatus')
        .attr('target', '_black');
    });

  $('#repo').append(content);
};

module.exports = showRepoTitle;
