import { ICellTools, INotebookTracker } from "@jupyterlab/notebook";
import { DisposableDelegate } from '@phosphor/disposable';
import { ToolbarButton } from '@jupyterlab/apputils';
import { PageConfig } from '@jupyterlab/coreutils'
import { CellToolsImageWidget } from "./components";
import "../style/index.css";

class SolutionsToolbarButton {
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

const createSolutionHeader = (cell, isFirstLoad, isTeacher) => {
  var solutionDiv = document.createElement('div');
  solutionDiv.className = 'rmotr-solutionHeaderContainer';
  solutionDiv.innerHTML = '<p class="rmotr-solutionText">Solution block</p>';
  if (!isTeacher) solutionDiv.innerHTML += '<button class="rmotr-toggleSolutionButton">Hide solution</button>';

  var cellHeader = cell.node.getElementsByClassName('jp-CellHeader')[0];
  cellHeader.appendChild(solutionDiv);

  if (!isTeacher) {
    var solutionButton = cell.node.getElementsByClassName('rmotr-toggleSolutionButton')[0];
    cell.inputArea.hide();
    solutionButton.innerHTML = 'Reveal solution';

    solutionButton.addEventListener('click', (evt) => {
      const isCollapsed = cell.inputArea.isHidden

      if (isCollapsed) {
        cell.inputArea.show();
        solutionButton.innerHTML = 'Hide solution';
      } else {
        cell.inputArea.hide();
        solutionButton.innerHTML = 'Reveal solution';
      }
    });
  } else {
    cell.inputArea.show();
  }
}

const toggleCellAsSolution = (cell, isFirstLoad, isTeacher) => {
  const { model } = cell;
  const { metadata } = model;
  const currentSolutionValue = metadata.get('is_solution');
  let newSolutionValue = currentSolutionValue;

  // update cell metadata with solution status if toggle button was clicked
  if (!isFirstLoad) {
    newSolutionValue = !currentSolutionValue;
    metadata.set("is_solution", newSolutionValue);
  }

  // first time element is marked as solution
  var solutionDiv = cell.node.getElementsByClassName('rmotr-solutionHeaderContainer')[0];
  if (!solutionDiv) createSolutionHeader(cell, isFirstLoad, isTeacher);
  
  // update class as solution
  if (newSolutionValue) {
    cell.addClass('rmotr-cell-isSolution');
  } else {
    cell.removeClass('rmotr-cell-isSolution');
  }
}

/**
 * Initialization data for the jupyterlab_rmotr_solutions extension.
 */
const activate = (app, cellTools, notebookTracker) => {
  console.log('>>> JupyterLab extension jupyterlab_rmotr_solutions (beta) is activated!');

  // add image widget on cellTools
  // const cellToolsImageWidget = new CellToolsImageWidget(notebookTracker);
  // cellTools.addItem({ tool: cellToolsImageWidget, rank: 0 });

  let isEnabled = true;
  let isTeacher = false;

  fetch(`${PageConfig.getBaseUrl()}rmotr-solutions`)
  .then(res => res.json())
  .then(res => {
    isEnabled = res.is_enabled;
    isTeacher = res.role === 'teacher';

    if (isEnabled) {
      if (isTeacher) {
        // add button on toolbar
        app.docRegistry.addWidgetExtension('Notebook', new SolutionsToolbarButton(notebookTracker));
      }

      // update solution cells
      notebookTracker.widgetAdded.connect(() => {
        const { currentWidget } = notebookTracker;

        currentWidget.revealed.then(() => {
          const { content } = currentWidget;

          content.widgets.forEach(cell => {
            toggleCellAsSolution(cell, true, isTeacher);
          })
        })
      })
    }
  });
}

const extension = {
  id: "jupyterlab_rmotr_solutions",
  autoStart: true,
  requires: [ICellTools, INotebookTracker],
  activate: activate
};

export default extension;