import demo from './demo';

demo();

import './demo.css';

// CSS 使用 图片
import '../../images/pcit.png';

import html from 'html-loader!../../html/demo/component.html';

$('body').append(html);
