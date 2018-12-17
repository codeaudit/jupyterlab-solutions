import { GraderWidget } from './graderWidget';

import { PanelLayout } from '@phosphor/widgets';

import { CellTools } from '@jupyterlab/notebook';

const GRADER_TOOL_CLASS = 'jp-cellGrader-Tools';

export class GraderTool extends CellTools.Tool {
  constructor(notebook_Tracker, app) {
    super();
    this.notebookTracker = notebook_Tracker;
    this.layout = new PanelLayout();
    this.addClass(GRADER_TOOL_CLASS);

    let widget = new GraderWidget(notebook_Tracker);
    this.layout.addWidget(widget);
  }
}
