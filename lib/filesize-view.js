'use babel';

import { Disposable } from 'atom'; // eslint-disable-line

import {
  addImageInfo,
  addMimeTypeInfo,
  addPrettyDateInfo,
  addPrettySize,
  addGzipSize,
} from 'filesize-calculator';

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
                 <div class="tooltip-arrow"></div>
                 <div class="tooltip-outer">
                   <div class="tooltip-inner" style="min-width: 36em; padding: .5em;"></div>
                 </div>
               </div>`,
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
  const {
    prettySize,
    gzipSize,
    mimeType,
    prettyDateCreated,
    prettyDateChanged,
    dimmensions,
    absolutePath,
    isRemote,
  } = info;
  const outer = document.createElement('div');
  const content = document.createElement('div');
  const infoContainer = document.createElement('table');

  content.style.cssText = `width: 100%; display: block; margin: 0; padding: 0;
                           background: inherit; border-radius: inherit;`;

  infoContainer.style.cssText = `display: block; border: 0;
                                 borderCollapse: collapse; padding: 0;
                                 width: 100%; background: rgba(0,0,0,0.75); color: #DDD;
                                 list-style: none; border-radius: inherit;
                                 margin: 0 auto`;
  let htmlItems = '';
  if (isRemote) htmlItems += createInfoItem('Remote file', 'YES');
  if (prettySize) htmlItems += createInfoItem('Size', prettySize);
  if (gzipSize) htmlItems += createInfoItem('Gzipped size', gzipSize);
  if (mimeType) htmlItems += createInfoItem('Mime type', mimeType);
  if (prettyDateCreated) htmlItems += createInfoItem('Creation date', prettyDateCreated);
  if (prettyDateChanged) htmlItems += createInfoItem('Last changed', prettyDateChanged);
  if (dimmensions) {
    htmlItems += createInfoItem('Dimmensions', `${dimmensions.width}x${dimmensions.height}`);
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
        if (info.isRemote) {
          tooltip = createTooltip(element, getHTMLForTooltip(info));
        } else {
          let content = addPrettyDateInfo(addImageInfo(addMimeTypeInfo(info)), currentConfig);
          if (currentConfig.showGzippedSize) content = addGzipSize(content, currentConfig);
          tooltip = createTooltip(element, getHTMLForTooltip(content));
        }
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
        useDecimal: atom.config.get('filesize.UseDecimal'),
        use24HourFormat: atom.config.get('filesize.DisplayFullDayTimeOnPopup'),
        showPopup: atom.config.get('filesize.EnablePopupAppearance'),
        showGzippedSize: atom.config.get('filesize.DisplayGzippedSizeOnPopup'),
      };
      const filesizeElement = parent.querySelector('.current-size');
      const statusInfo = addPrettySize(rawInfo, config);
      if (filesizeElement) {
        if (rawInfo.isRemote) {
          filesizeElement.innerHTML = '~' + statusInfo.prettySize;
        } else {
          filesizeElement.innerHTML = statusInfo.prettySize;
        }
      }
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
      self.container.parentNode.removeChild(self.container);
      return self;
    },
  };

  return self;
}

export default filesizeView;
