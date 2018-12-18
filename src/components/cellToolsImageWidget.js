import { PanelLayout, Widget } from '@phosphor/widgets';
import { CellTools } from '@jupyterlab/notebook';

export class CellToolsImageWidget extends CellTools.Tool {
  constructor(notebookTracker) {
    super();

    let widget = new Widget();
    widget.node.appendChild(this._getWidgetContent());

    this.layout = new PanelLayout();
    this.layout.addWidget(widget);
  }

  _getWidgetContent() {
    let image = document.createElement('img');
    image.src = 'https://notebooks.rmotr.com/_next/static/images/logo-white-5ab25a5b.png';
    image.style.cssText = 'max-width: 120px;';

    const widgetContainer = document.createElement('div');
    widgetContainer.style.cssText = 'background-color: #3390FF; text-align: center; padding: 30px;';
    widgetContainer.appendChild(image);

    return widgetContainer;
  }
}