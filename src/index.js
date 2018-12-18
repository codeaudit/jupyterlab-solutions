import { ICellTools, INotebookTracker } from "@jupyterlab/notebook";
import { DisposableDelegate } from '@phosphor/disposable';
import { ToolbarButton } from '@jupyterlab/apputils';
import { PageConfig } from '@jupyterlab/coreutils'
import { GraderTool } from "./components";
import "../style/index.css";

class ButtonExtension {
  constructor(notebookTracker) {
    this.notebookTracker = notebookTracker;
  }

  createNew(panel, context) {
    let handleSolutionButton = () => {
      const activeCell = this.notebookTracker.activeCell;

      toggleCellAsSolution(activeCell)
    }
  
    let solutionButton = new ToolbarButton({
      className: `solution-button`,
      label: 'Mark as solution',
      iconClassName: 'fa fa-graduation-cap',
      onClick: handleSolutionButton,
      tooltip: 'Show Input'
    });

    panel.toolbar.insertItem(10, 'text', solutionButton);
	
    return new DisposableDelegate(() => {
	    solutionButton.dispose();
    });
  }
}

const createSolutionHeader = (cell) => {
  var solutionDiv = document.createElement('div');
  solutionDiv.className = 'rmotr-solutionHeaderContainer';
  solutionDiv.innerHTML = `
    <p class="rmotr-solutionText">Solution block</p>
    <button class='rmotr-toggleSolutionButton'>Hide solution</button>
  `;

  var cellHeader = cell.node.getElementsByClassName('jp-CellHeader')[0];
  cellHeader.appendChild(solutionDiv);

  var solutionButton = cell.node.getElementsByClassName('rmotr-toggleSolutionButton')[0];

  solutionButton.addEventListener('click', (evt) => {
    if (cell.inputArea.isHidden) {
      cell.inputArea.show();
      solutionButton.innerHTML = 'Hide solution';
    } else {
      cell.inputArea.hide();
      solutionButton.innerHTML = 'Reveal solution';
    }
  });
}

const toggleCellAsSolution = (cell, firstLoad) => {
  const { model } = cell;
  const { metadata } = model;
  const currentSolutionValue = metadata.get('is_solution');
  let newSolutionValue = currentSolutionValue;

  // update cell metadata with solution status if toggle button was clicked
  if (!firstLoad) {
    newSolutionValue = !currentSolutionValue;
    metadata.set("is_solution", newSolutionValue);
  }

  // first time element is marked as solution
  var solutionDiv = cell.node.getElementsByClassName('rmotr-solutionHeaderContainer')[0];
  if (!solutionDiv) createSolutionHeader(cell);
  
  // update class as solution
  if (newSolutionValue) {
    cell.addClass('rmotr-cell-isSolution');
  } else {
    cell.removeClass('rmotr-cell-isSolution');
  }
}

/**
 * Initialization data for the jupyterlab_myfirstextension extension.
 */
const activate = (app, cellTools, notebookTracker) => {
  console.log('JupyterLab extension jupyterlab_myfirstextension is activated!');
  // const graderTool = new GraderTool(notebookTracker, app);
  // cellTools.addItem({ tool: graderTool, rank: 0 });

  // add button on toolbar
  app.docRegistry.addWidgetExtension('Notebook', new ButtonExtension(notebookTracker));
  
  console.log('=== NOTEBOOK TRACKER: ', notebookTracker);

  fetch(PageConfig.getBaseUrl() + "grader")
  .then(res => res.json())
  .then(res => {
    console.log('==== VARIABLES LOADED: ', res);
  });

  // update solution cells
  notebookTracker.widgetAdded.connect(() => {
    const { currentWidget } = notebookTracker;

    currentWidget.revealed.then(() => {
      const { content } = currentWidget;

      content.widgets.forEach(cell => {
        toggleCellAsSolution(cell, true);
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