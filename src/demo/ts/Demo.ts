import { TinyMCE } from 'tinymce';

import Plugin from '../../main/ts/Plugin';

declare let tinymce: TinyMCE;

Plugin();

tinymce.init({
  selector: 'textarea.tinymce',
  plugins: 'code tooltip link',
  icons: 'custom',
  toolbar: 'tooltip',
  content_css:
  [
    'https://use.fontawesome.com/releases/v6.2.0/css/all.css'
  ]
});
