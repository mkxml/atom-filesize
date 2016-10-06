'use babel';

/* eslint-disable */
import { Disposable, CompositeDisposable } from 'atom';
/* eslint-enable */

import {
  addImageInfo,
  addMimeTypeInfo,
  addPrettyDateInfo,
  addPrettySize,
} from './filesize-calculator';

function createContainer() {
  const container = document.createElement('div');
  container.className = 'file-size inline-block';
  const tooltipLink = document.createElement('a');
  tooltipLink.className = 'file-size-link';
  const filesizeElement = document.createElement('span');
  filesizeElement.className = 'current-size';
  tooltipLink.appendChild(filesizeElement);
  container.appendChild(tooltipLink);
  return container;
}

function createTooltip(target, htmlContent) {
  return atom.tooltips.add(target, {
    template: `<div class="tooltip" role="tooltip">
                 <div class="tooltip-arrow"></div><div class="tooltip-outer">
               <div class="tooltip-inner" style="padding: 0;"></div></div></div>`,
    title: htmlContent,
    placement: 'top',
    trigger: 'click',
    delay: 0,
    animation: false,
  });
}

function createInfoItem(label, info) {
  return `<tr style='display: block; width: 100%; padding: 0; margin: 0;'>
            <td style='width: 40%; padding: 10px 20px; margin: 0; display:
             inline-block; text-align: right; vertical-align: middle;'>
              ${label}
            </td>
            <td style='width: 50%; padding: 10px 20px; margin: 0; display:
             inline-block; text-align: left; vertical-align: middle;'>
              ${info}
            </td>
          </tr>`;
}

function getHTMLForTooltip(info) {
  const { prettySize, mimeType, dateCreated, dateChanged, dimmensions, absolutePath } = info;
  const outer = document.createElement('div');
  const content = document.createElement('div');
  const infoContainer = document.createElement('table');

  content.style.cssText = `width: 100%; display: block; margin: 0; padding: 8px;
                           background: inherit; border-radius: inherit;`;

  infoContainer.style.cssText = `display: block; border: 0;
                                 borderCollapse: collapse; padding: 0;
                                 width: 100%; min-width: 35em;
                                 background: black; color: #DDD; opacity: .75;
                                 list-style: none; border-radius: inherit;
                                 margin: 0 auto`;
  let htmlItems = '';
  if (prettySize) htmlItems += createInfoItem('Size', prettySize);
  if (mimeType) htmlItems += createInfoItem('Mime type', mimeType);
  if (dateCreated) htmlItems += createInfoItem('Creation date', dateCreated);
  if (dateChanged) htmlItems += createInfoItem('Last changed', dateChanged);
  if (dimmensions) {
    htmlItems += createInfoItem(
    'Dimmensions',
    `${dimmensions.width}x${dimmensions.height}`
    );
  }

  infoContainer.innerHTML = `<tbody style="display: block; width: 100%;">
                              ${htmlItems}
                             <tbody/>`;

  const titleContainer = document.createElement('p');
  titleContainer.style.fontSize = '1em';
  const title = document.createTextNode(absolutePath);
  titleContainer.appendChild(title);
  content.appendChild(titleContainer);
  content.appendChild(infoContainer);
  outer.appendChild(content);
  return outer.innerHTML;
}

function filesizeView(parent) {
  const disposables = new CompositeDisposable();
  const config = {
    useKibibyteRepresentation: true,
    use24HourFormat: true,
    showPopup: true,
  };
  disposables.add(atom.config.observe('filesize.KibibyteRepresentation', (checked) => {
    config.useKibibyteRepresentation = checked;
  }));
  disposables.add(atom.config.observe('filesize.DisplayFullDayTimeOnPopup', (checked) => {
    config.use24HourFormat = checked;
  }));
  disposables.add(atom.config.observe('filesize.EnablePopupAppearance', (checked) => {
    config.showPopup = checked;
  }));

  let tooltip = null;

  const self = {
    container: createContainer(),
    refresh(rawInfo) {
      const filesizeElement = parent.querySelector('.current-size');
      const statusInfo = addPrettySize(rawInfo, config);
      if (filesizeElement) filesizeElement.innerHTML = statusInfo.prettySize;
      self.hideTooltip();
      if (config.showPopup) {
        const tooltipInfo = addPrettyDateInfo(addImageInfo(addMimeTypeInfo(statusInfo)), config);
        tooltip = createTooltip(filesizeElement, getHTMLForTooltip(tooltipInfo));
      }
      return self;
    },

    hideTooltip() {
      if (tooltip) tooltip.dispose();
      tooltip = null;
      return self;
    },

    clean() {
      const filesizeElement = parent.querySelector('.current-size');
      if (filesizeElement) filesizeElement.innerHTML = '';
      self.hideTooltip();
      return self;
    },

    destroy() {
      self.hideTooltip();
      self.clean();
      disposables.dispose();
    },
  };

  return self;
}


export default filesizeView;