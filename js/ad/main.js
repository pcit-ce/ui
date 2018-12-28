let ad = [
  {
    src:
      'https://user-images.githubusercontent.com/16733187/50481394-34a37380-0a1c-11e9-9f92-91bf6c74d06d.jpg',
    title: '微信扫码赞助本项目(点击查看大图)',
    url: null,
  },
  {
    src:
      'https://user-images.githubusercontent.com/16733187/49062650-de41ea00-f24f-11e8-9f22-99b5cd3d0195.jpg',
    title: '掌上 PCIT (点击查看大图)',
    url: null,
  },
  {
    src: 'https://avatars3.githubusercontent.com/u/13629408?s=200&v=4',
    title: 'Kubernetes 免费实验室',
    url:
      'https://cloud.tencent.com/redirect.php?redirect=10058&cps_key=3a5255852d5db99dcd5da4c72f05df61',
  },
  {
    src: 'https://opensource.guide/assets/images/illos/leadership.svg',
    title: '共建 PCIT 生态系统',
    url: 'https://github.com/pcit-ce',
  },
  {
    src:
      'https://user-images.githubusercontent.com/16733187/50481566-4c2f2c00-0a1d-11e9-95aa-4f7ac4c29a2a.jpg',
    title: '阿里云学生专享服务器 ￥9.5/月',
    url:
      'https://promotion.aliyun.com/ntms/act/campus2018.html?utm_content=se_1000442301&userCode=8lx5zmtu',
  },
  {
    src:
      'https://user-images.githubusercontent.com/16733187/50482957-5b65a800-0a24-11e9-9213-78d6ae48d326.jpg',
    title: '阿里云服务器',
    url: 'https://promotion.aliyun.com/ntms/act/qwbk.html?userCode=8lx5zmtu',
  },
  {
    src:
      'https://user-images.githubusercontent.com/16733187/50481913-19863300-0a1f-11e9-9753-eecdb2bb103b.jpg',
    title: '支付宝线下红包(点击查看大图)',
    url: null,
  },
  {
    src:
      'https://user-images.githubusercontent.com/16733187/50481566-4c2f2c00-0a1d-11e9-95aa-4f7ac4c29a2a.jpg',
    title: '企业赞助 ￥500/月，您的 Log 将随机展示到本站',
    url: 'mailto:ci@khs1994.com',
  },
];

let showAd = index => {
  $('.fixedAd').remove();

  if ($(document).width() < 1426) {
    return;
  }

  if (index === undefined) {
    index = Math.floor(Math.random() * ad.length);
  }

  let { src, title, url } = ad[index];

  url = url === null ? src : url;

  $('body').append(
    $('<a class="alert alert-light fixedAd" role="alert"></a>')
      .append(
        $(`<img style="width: 200px; height: 200px"/>`).attr({
          src,
        }),
      )
      .append(
        $('<div></div>')
          .append(title)
          .css({
            'margin-top': '1px',
            'text-align': 'center',
          }),
      )
      .css({
        position: 'fixed',
        top: '65%',
        right: '2%',
        width: '240px',
        height: '240px',
        display: 'block',
        'text-decoration': 'none',
        color: '#000',
      })
      .attr({
        href: url,
        target: '_blank',
      })
      .alert(),
  );
};

showAd(0);

setInterval(showAd, 10000);
