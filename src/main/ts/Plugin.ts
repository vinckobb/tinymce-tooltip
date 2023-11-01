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
          editor.insertContent('<span data-tooltip-plugin class="fa fa-circle-question" data-mce-contenteditable="false" title="' + data.title + '"><!--icon--></span>');
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

    const tooltipNodes = editor.dom.select('span[data-tooltip-plugin]');
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

  editor.on('TextColorChange', e => {
    const tooltip = Utils.getTooltipElement(editor, editor.selection.getNode());
    //Can we get all tooltips from active selections?
    if (tooltip)
    {
      switch (e.name)
      {
        case 'forecolor':
          tooltip.style.color = e.color;
          break;
        case 'backcolor':
          tooltip.style.backgroundColor = e.color;
          break;
      }
    }
  })

  editor.ui.registry.addToggleButton('tooltip', {
    icon: 'help',
    tooltip: 'Tooltip',
    onSetup: (buttonApi) => editor.selection.selectorChangedWithUnbind('span[data-tooltip-plugin]', buttonApi.setActive).unbind, //Handles toolbar button activity state
    onAction: openDialog
  });

  editor.contentStyles = [`
    span[data-tooltip-plugin][data-mce-selected] 
    {
      outline: 3px solid #4099ff;
    }
  `];
};

export default (): void => {
  tinymce.PluginManager.add('tooltip', setup);
};
