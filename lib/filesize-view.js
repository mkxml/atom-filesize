'use babel';

/* eslint-disable */
import { Disposable } from 'atom';
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
    trigger: 'manual',
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
  let tooltip = null;
  let tooltipListener = null;

  function hideTooltip(event) {
    if (event && event.target.className === '.tooltip') return true;
    if (tooltip) tooltip.dispose();
    tooltip = null;
    parent.removeEventListener('click', hideTooltip, false);
    return true;
  }

  function prepareTooltip(element, info, currentConfig) {
    return (() => {
      if (!tooltip) {
        const content = addPrettyDateInfo(addImageInfo(addMimeTypeInfo(info)), currentConfig);
        tooltip = createTooltip(element, getHTMLForTooltip(content));
        setTimeout(() => {
          parent.addEventListener('click', hideTooltip, false);
        }, 0);
      }
      return false;
    });
  }

  const self = {
    container: createContainer(),
    refresh(rawInfo) {
      const config = {
        useKibibyteRepresentation: atom.config.get('filesize.KibibyteRepresentation'),
        use24HourFormat: atom.config.get('filesize.DisplayFullDayTimeOnPopup'),
        showPopup: atom.config.get('filesize.EnablePopupAppearance'),
      };
      const filesizeElement = parent.querySelector('.current-size');
      const statusInfo = addPrettySize(rawInfo, config);
      if (filesizeElement) filesizeElement.innerHTML = statusInfo.prettySize;
      const showTooltip = prepareTooltip(filesizeElement, statusInfo, config);
      hideTooltip();
      if (tooltipListener) tooltipListener.dispose();
      tooltipListener = null;
      if (config.showPopup && !tooltip) {
        const filesizeLink = parent.querySelector('.file-size-link');
        filesizeLink.addEventListener('click', showTooltip, false);
        tooltipListener = new Disposable(() => filesizeLink
          .removeEventListener('click', showTooltip, false));
      }
      return self;
    },


    clean() {
      hideTooltip();
      const filesizeElement = parent.querySelector('.current-size');
      if (filesizeElement) filesizeElement.innerHTML = '';
      if (tooltipListener) tooltipListener.dispose();
      tooltipListener = null;
      return self;
    },

    destroy() {
      hideTooltip();
      self.clean();
    },
  };

  return self;
}


export default filesizeView;
