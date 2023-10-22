import { Editor, TinyMCE } from 'tinymce';

import * as Utils from './core/Utils';

declare const tinymce: TinyMCE;

const setup = (editor: Editor): void => {
  const openDialog = function () {
    const selectedTooltip = Utils.getTooltipElement(editor, editor.selection.getNode());
    let title = '';
    if (selectedTooltip)
    {
      title = selectedTooltip.getAttribute('title');
    }

    return editor.windowManager.open({
      title: 'Tooltip',
      size: 'medium',
      body: {
        type: 'panel',
        items: [
          {
            type: 'textarea',
            maximized: true,
            name: 'title',
            label: 'Text',
          }
        ],
      },
      buttons: [
        {
          type: 'cancel',
          text: 'Zavrieť'
        },
        {
          type: 'submit',
          text: 'Uložiť',
          primary: true
        }
      ],
      initialData:
      {
        title: title,
      },
      onSubmit: function (api) {
        const data = api.getData();

        const selectedTooltip = Utils.getTooltipElement(editor, editor.selection.getNode());
        if (selectedTooltip)
        {
          selectedTooltip.setAttribute('title', data.title);
        }
        else
        {
          /* Insert content when the window form is submitted */
          editor.insertContent('<span class="tooltip fa fa-circle-question" data-mce-contenteditable="false" title="' + data.title + '"><!-- icon --></span>');
        }
        api.close();
      }
    });
  };

  editor.on('click', e => {
    const tooltip = Utils.getTooltipElement(editor, e.target);
    if (tooltip)
    {
      editor.selection.select(tooltip, true);
      tooltip.setAttribute('data-mce-selected', '1');
    }

    const tooltipNodes = editor.dom.select('span.tooltip');
    if (tooltipNodes && tooltipNodes.length > 0)
    {
      tooltipNodes.forEach(node => 
        {
          if (!tooltip || node !== tooltip)
          {
            node.removeAttribute('data-mce-selected');
          }
        });
    }
  });

  editor.ui.registry.addToggleButton('tooltip', {
    icon: 'help',
    tooltip: 'Tooltip',
    onSetup: (buttonApi) => editor.selection.selectorChangedWithUnbind('span.tooltip', buttonApi.setActive).unbind, //Handles toolbar button activity state
    onAction: openDialog
  });

  editor.contentStyles = [`
    span.tooltip[data-mce-selected] 
    {
      outline: 3px solid #4099ff;
    }

    .tooltip
    {
      display: inline-block;
      height: 1em;
      width: 1em;
      background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'><path d='M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM169.8 165.3c7.9-22.3 29.1-37.3 52.8-37.3h58.3c34.9 0 63.1 28.3 63.1 63.1c0 22.6-12.1 43.5-31.7 54.8L280 264.4c-.2 13-10.9 23.6-24 23.6c-13.3 0-24-10.7-24-24V250.5c0-8.6 4.6-16.5 12.1-20.8l44.3-25.4c4.7-2.7 7.6-7.7 7.6-13.1c0-8.4-6.8-15.1-15.1-15.1H222.6c-3.4 0-6.4 2.1-7.5 5.3l-.4 1.2c-4.4 12.5-18.2 19-30.6 14.6s-19-18.2-14.6-30.6l.4-1.2zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z'/></svg>");
    }
  `];
};

export default (): void => {
  tinymce.PluginManager.add('tooltip', setup);
};
