const show = () => {
  //   $('header').append(`
  // <span class="ico"><img class="rounded" alt='pcit' title="PCIT IS A PHP CI TOOLKIT" id="pcit_ico" src="/ico/pcit.png"/></span>
  // <span class="docs"><a href="//docs.ci.khs1994.com" target="_blank">Documentation</a></span>
  // <span class="plugins"><a href="//docs.ci.khs1994.com/plugins/" target="_blank">Plugins</a></span>
  // <span class="donate"><a href="//zan.khs1994.com" target="_blank">Donate</a></span>
  // <span class="username">username</span>
  // `);
  $('header').append(`
    <nav class="navbar navbar-dark bg-dark navbar-expand-lg">
    <div class="container">
    <a class="navbar-brand" href="">PCIT</a>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
  <span class="navbar-toggler-icon"></span>
</button>
    <div class="collapse navbar-collapse" id="navbarSupportedContent">

    <ul class="navbar-nav mr-auto">
        <li class="nav-item">
          <a class="nav-link" target="_blank" href="//ci.khs1994.com/changelog">CHANGELOG</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" target="_blank" href="//docs.ci.khs1994.com">Documentation</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" target="_blank" href="//docs.ci.khs1994.com/usage/security.html">Security</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" target="_blank" href="//docs.ci.khs1994.com/api/">API</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" target="_blank" href="https://github.com/pcit-ce/pcit">GitHub</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" target="_blank" href="//ci.khs1994.com/donate">Donate</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" target="_blank" href="https://cloud.tencent.com/redirect.php?redirect=10058&cps_key=3a5255852d5db99dcd5da4c72f05df61">
          Kubernetes</a>
        </li>

        <li class="nav-item dropdown userHeader" style="display:none">
        <a class="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          <img class="rounded" src="" style="width:20px;height:20px"/>
        </a>
        <div class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
          <a class="dropdown-item gitType disabled">Git Powered By </a>
          <a class="dropdown-item username disabled" >Welcome </a>
          <div class="dropdown-divider"></div>
          <a class="dropdown-item profile">Profile</a>
          <a class="dropdown-item settings">Settings</a>
          <div class="dropdown-divider"></div>
          <a class="dropdown-item invite">邀请好友</a>
          <div class="dropdown-divider"></div>
          <a class="dropdown-item logout">Sign out</a>
        </li>

        <li class="nav-item login" style="display:none">
        <a class="nav-link" href="/login">Sign in</a>
        </li>
    </ul>
    </div>
    </div>
  </nav>`);
};

module.exports.show = show;
