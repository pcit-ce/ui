const git = require('../common/git');
const title = require('./title');
import url from './url';

const showRepoTitle = () => {
  let content = jQuery('<h1 class="repo_title"></h1>');

  let type = url.getType();
  let gitType = url.getGitType();

  title.show(url.getBaseTitle(), type);

  let gitIcoUrl = git.getIcoUrl(gitType);
  let git_format = git.format(gitType);

  content
    .append(
      $('<a class="h1_git_type"></a>')
        .append(
          $('<img/>')
            .append(git_format)
            .css({
              float: 'left',
              width: '24px',
              height: '24px',
              //'margin-top': '-6px',
            })
            .attr({
              title: 'View Repository on ' + git_format,
              src: gitIcoUrl,
            }),
        )
        .attr({
          href: git.getUrl(url.getUsername(), url.getRepo(), url.getGitType()),
          target: '_block',
        })
        .css({
          display: 'block',
        }),
    )
    .append(
      $('<a class="h1_username">')
        .append(url.getUsername())
        .attr({
          href: [url.getHost(), url.getGitType(), url.getUsername()].join('/'),
        }),
    )
    .append($('<span></span>').append(' / '))
    .append(
      $('<a class="h1_repo"></a>')
        .append(url.getRepo())
        .attr(
          'href',
          [
            url.getHost(),
            url.getGitType(),
            url.getUsername(),
            url.getRepo(),
          ].join('/'),
        ),
    )
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

export default showRepoTitle;
