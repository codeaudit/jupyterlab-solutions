import { ICellTools, INotebookTracker, editorConfig } from "@jupyterlab/notebook";

import { GraderTool } from "./components";

import "../style/index.css";





import {
  DisposableDelegate
} from '@phosphor/disposable';

import {
  ToolbarButton
} from '@jupyterlab/apputils';

import {
  NotebookActions, NotebookPanel, INotebookModel
} from '@jupyterlab/notebook';

class ButtonExtension { 
  constructor(notebookTracker) {
    this.notebookTracker = notebookTracker;
  }

  createNew(panel, context) {
    let hideInputCode = () => {
      NotebookActions.hideAllCode(panel.content);
    };

    let showInputCode = () => {
      NotebookActions.showAllCode(panel.content);
    };

    let markAsSolution = () => {
      const activeCell = this.notebookTracker.activeCell;
      const model = activeCell.model;
      const metadata = model.metadata;
      const isSolution = metadata.get('is_solution');

      if (isSolution) {
        activeCell.removeClass('rmotr-cell-isSolution');
      } else {
        activeCell.addClass('rmotr-cell-isSolution');
      }

      metadata.set("is_solution", !isSolution);
    }
  
    // let buttonHideInput = new ToolbarButton({
    //   className: 'myButton',
    //   iconClassName: 'fa fa-eye-slash',
    //   onClick: hideInputCode,
    //   tooltip: 'Hide Input'
    // });
	
    // let buttonShowInput = new ToolbarButton({
    //   className: 'myButton',
    //   iconClassName: 'fa fa-eye',
    //   onClick: showInputCode,
    //   tooltip: 'Show Input'
    // });

    let solutionButton = new ToolbarButton({
      className: `solution-button`,
      label: 'Mark as solution',
      iconClassName: 'fa fa-graduation-cap',
      onClick: markAsSolution,
      tooltip: 'Show Input'
    });

    panel.toolbar.insertItem(10, 'text', solutionButton);
    // panel.toolbar.insertItem(10, 'hideInput', buttonHideInput);
	  // panel.toolbar.insertItem(10, 'showInput', buttonShowInput);
	
    return new DisposableDelegate(() => {
      buttonHideInput.dispose();
	    buttonShowInput.dispose();
	    solutionButton.dispose();
    });
  }
}


/**
 * Initialization data for the jupyterlab_myfirstextension extension.
 */
const activate = (app, cellTools, notebookTracker) => {
  console.log('JupyterLab extension jupyterlab_myfirstextension is activated!');
  const graderTool = new GraderTool(notebookTracker, app);
  cellTools.addItem({ tool: graderTool, rank: 0 });

  app.docRegistry.addWidgetExtension('Notebook', new ButtonExtension(notebookTracker));
  
  // react on notebook tracker changes
  console.log('ENV', app)
  console.log(notebookTracker)






  notebookTracker.activeCellChanged.connect(() => {
    const { currentWidget } = notebookTracker;

    currentWidget.revealed.then(() => {
      const { content } = currentWidget;

      content.widgets.forEach(cell => {
        // console.log(cell)

        const { model, node } = cell;
        const metadata = model.metadata;
        const isSolution = metadata.get('is_solution');

        if (isSolution) {
          cell.addClass('rmotr-cell-isSolution');
          // cell.inputArea.hide();
        }
      })
    })
  })
}

const extension = {
  id: "jupyterlab-myfirstextension",
  autoStart: true,
  requires: [ICellTools, INotebookTracker],
  activate: activate
};

export default extension;