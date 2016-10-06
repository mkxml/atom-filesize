'use babel';

// Lazy load node modules
let fs;
let mime;
let imageSize;
let moment;

const KIBIBYTE_BASE = 1024;

const SI_BASE = 1000;

const FORMAT_24_HOUR = 'HH:mm:ss';

const FORMAT_12_HOUR = 'h:mm:ss a';

const KIBIBYTE_REPRESENTATION = [
  'bytes',
  'KiB',
  'MiB',
  'GiB',
  'TiB',
  'PiB',
  'EiB',
  'ZiB',
  'YiB',
];

const SI_REPRESENTATION = [
  'bytes',
  'KB',
  'MB',
  'GB',
  'TB',
  'PB',
  'EB',
  'ZB',
  'YB',
];

const IMAGE_FORMATS = [
  'image/bmp',
  'imagem/jpeg',
  'image/png',
  'image/gif',
  'image/tiff',
  'image/x-tiff',
  'image/webp',
  'image/vnd.adobe.photoshop',
];

function loadFileInfoAsync(filepath) {
  fs = fs || require('fs');
  return new Promise((resolve, reject) => {
    if (filepath) {
      fs.stat(filepath, (err, stats) => {
        if (!err) {
          const info = {
            absolutePath: filepath,
            size: stats.size,
            dateCreated: stats.birthtime,
            dateChanged: stats.mtime,
          };
          resolve(info);
        } else {
          reject(new Error('Can\'t get size for the current path'));
        }
      });
    } else {
      reject(new Error('Please provide a valid filepath'));
    }
  });
}

function addPrettySize(info, { useKibibyteRepresentation = true }) {
  const { size } = info;
  if (size === 0) return Object.assign(info, { prettySize: '0 bytes' });
  if (size === 1) return Object.assign(info, { prettySize: '1 byte' });
  const base = (useKibibyteRepresentation) ? KIBIBYTE_BASE : SI_BASE;
  const suffixes = (useKibibyteRepresentation) ? KIBIBYTE_REPRESENTATION : SI_REPRESENTATION;
  const scale = Math.floor(Math.log(size) / Math.log(base));
  const activeSuffix = suffixes[scale];
  const scaledSize = size / Math.pow(base, scale);
  // Round size with a decimal precision of 2
  const fixedScale = Math.round(`${scaledSize}e+2`);
  const roundedSize = Number(`${fixedScale}e-2`);
  const prettySize = `${roundedSize} ${activeSuffix}`;
  return Object.assign(info, { prettySize });
}

function addMimeTypeInfo(info) {
  mime = mime || require('mime');
  const mimeType = mime.lookup(info.absolutePath);
  return Object.assign(info, { mimeType });
}

function addImageInfo(info) {
  if (!info.mimeType || !IMAGE_FORMATS.includes(info.mimeType)) return info;
  imageSize = imageSize || require('image-size');
  const dimmensions = imageSize(info.absolutePath);
  return Object.assign(info, { dimmensions });
}

function addPrettyDateInfo(info, { use24HourFormat = true }) {
  moment = moment || require('moment');
  const hourFormat = (use24HourFormat) ? FORMAT_24_HOUR : FORMAT_12_HOUR;
  const dateCreated = moment(info.dateCreated).format(`MMMM Do YYYY, ${hourFormat}`);
  const dateChanged = moment(info.dateChanged).format(`MMMM Do YYYY, ${hourFormat}`);
  return Object.assign(info, { dateCreated, dateChanged });
}

export {
  loadFileInfoAsync,
  addPrettySize,
  addMimeTypeInfo,
  addImageInfo,
  addPrettyDateInfo,
};
