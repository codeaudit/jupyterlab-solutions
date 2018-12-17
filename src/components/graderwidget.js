import { Widget } from '@phosphor/widgets';

export class GraderWidget extends Widget {
  constructor(notebook_Tracker) {
    super();
    this._tracker = notebook_Tracker;
    this.node.appendChild(this._getWidgetContent());

    console.log(this._tracker.activeCell)
  }

  _getActiveCell() {
    console.log('GET ACTIVE CELL');
    console.log(this._tracker.activeCell);
  }

  _getWidgetContent() {
    let image = document.createElement('img');
    image.src = 'https://notebooks.rmotr.com/_next/static/images/logo-white-5ab25a5b.png';
    image.alt = 'alt';
    image.title = 'title';
    image.style.cssText = 'max-width: 120px;';

    const imageContainer = document.createElement('div');
    imageContainer.className = 'image-container';
    imageContainer.style.cssText = 'background-color: #3390FF; text-align: center; padding: 30px;';
    imageContainer.appendChild(image);

    const widgetContainer = document.createElement('div');
    widgetContainer.onClick = this._getActiveCell;
    widgetContainer.className = 'widget-container';
    widgetContainer.appendChild(imageContainer);

    return widgetContainer;
  }
}