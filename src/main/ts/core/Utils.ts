import { Editor } from "tinymce";

const isInTooltip = (editor: Editor, selectedElm?: Element): boolean => getTooltipElement(editor, selectedElm) != null;

const getTooltipElement = (editor: Editor, selectedElm?: Element): HTMLElement => {
  selectedElm = selectedElm || editor.selection.getNode();
  return editor.dom.getParent<HTMLElement>(selectedElm, 'span[data-tooltip-plugin]');
};

export {
    isInTooltip,
    getTooltipElement
};