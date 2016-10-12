'use babel';

import moment from 'moment';

import {
  loadFileInfoAsync,
  addPrettyDateInfo,
  addImageInfo,
  addPrettySize,
  addMimeTypeInfo,
} from '../lib/filesize-calculator';

let editor = null;

describe('Calculator functions', () => {
  describe('when fetching file size info', () => {
    beforeEach(() => {
      waitsForPromise(() => atom.workspace.open(`${__dirname}/fixtures/test.txt`)
        .then((e) => {
          editor = e;
        })
      );
    });
    it('should return the correct file size for a valid file', () => {
      const filepath = editor.buffer.file.path;
      waitsForPromise(() => loadFileInfoAsync(filepath).then(o => expect(o.size).toEqual(5)));
    });
    it('should return error when trying to open a file that does not exist', () => {
      const filepath = `${__dirname}/invalid.txt`;
      waitsForPromise(() => loadFileInfoAsync(filepath).catch(err => expect(err).not.toBeNull()));
    });
  });
  describe('when getting readable size', () => {
    it('should handle empty files', () => {
      let info = { size: 0 };
      info = addPrettySize(info, { useKibibyteRepresentation: true });
      expect(info.prettySize).toEqual('0 bytes');
    });
    it('should output correct english for 1 byte files', () => {
      let info = { size: 1 };
      info = addPrettySize(info, { useKibibyteRepresentation: true });
      expect(info.prettySize).toEqual('1 byte');
    });
    it('should handle kibibyte representation correctly', () => {
      let info = { size: 1023 };
      info = addPrettySize(info, { useKibibyteRepresentation: true });
      expect(info.prettySize).toEqual('1023 bytes');
    });
    it('should handle SI representation correctly', () => {
      let info = { size: 1023 };
      info = addPrettySize(info, { useKibibyteRepresentation: false });
      expect(info.prettySize).toEqual('1.02 KB');
    });
    it('should handle large files', () => {
      let info = { size: 1073741824 };
      info = addPrettySize(info, { useKibibyteRepresentation: true });
      expect(info.prettySize).toEqual('1 GiB');
      info = addPrettySize(info, { useKibibyteRepresentation: false });
      expect(info.prettySize).toEqual('1.07 GB');
    });
  });
  describe('when getting tooltip info', () => {
    const filepath = `${__dirname}/fixtures/test.txt`;
    const dateCreated = moment('1970-01-01T00:00:00Z').toDate();
    const dateChanged = moment('1970-01-01T00:00:00Z').toDate();
    it('should get the mime type info', () => {
      let info = { absolutePath: filepath };
      info = addMimeTypeInfo(info);
      expect(info.mimeType).toEqual('text/plain');
    });
    it('should get the pretty date and time info for 24 hour format', () => {
      let info = {
        absolutePath: filepath,
        dateCreated,
        dateChanged,
      };
      info = addPrettyDateInfo(info, { use24HourFormat: true });
      expect(moment(info.dateCreated, 'HH:mm:ss').toDate()).toEqual(dateCreated);
      expect(moment(info.dateChanged, 'HH:mm:ss').toDate()).toEqual(dateChanged);
    });
    it('should get the pretty date and time info for 12 hour format', () => {
      let info = {
        absolutePath: filepath,
        dateCreated,
        dateChanged,
      };
      info = addPrettyDateInfo(info, { use24HourFormat: false });
      expect(moment(info.dateCreated, 'H:mm:ss a').toDate()).toEqual(dateCreated);
      expect(moment(info.dateChanged, 'H:mm:ss a').toDate()).toEqual(dateChanged);
    });
    it('should get image dimmensions', () => {
      const imagePath = `${__dirname}/fixtures/atom_icon.png`;
      let info = {
        absolutePath: imagePath,
        mimeType: 'image/png',
      };
      info = addImageInfo(info);
      expect(info.dimmensions.width).toEqual(25);
      expect(info.dimmensions.height).toEqual(25);
    });
  });
});
