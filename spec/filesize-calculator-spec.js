'use babel';

import {
  loadFileInfoAsync,
  getReadableSize,
  addPrettyDateInfo,
  addImageInfo,
  addPrettySize,
  addMimeTypeInfo,
} from '../lib/filesize-calculator';

let editor = null;

describe('Calculator functions', () => {
  describe('when fetching file size info', () => {
    beforeEach(() => {
      waitsForPromise(() => atom.workspace.open('../fixtures/test.txt').then((e) => {
        editor = e;
      }));
    });
    it('should return the correct file size for a valid file', () => {
      const filepath = editor.buffer.file.path;
      console.log(filepath);
      waitsForPromise(() => {
        loadFileInfoAsync(filepath).then(info => expect(info.size).toEqual(5));
      });
    });
  });
});
