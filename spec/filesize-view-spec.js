'use babel';

import filesizeView from '../lib/filesize-view';

const workspaceView = atom.views.getView(atom.workspace);

beforeEach(() => {
  waitsForPromise(() => atom.packages.activate('status-bar')
    .then(() => atom.workspace.open('../fixtures/test.txt'))
    .then(() => atom.packages.activate('filesize')));
});
describe('when refreshing the view', () => {
  it('should display the human readable size', () => {
    const filesizeElement = workspaceView.querySelector('.file-size');
    expect(filesizeElement.text).toEqual('5 bytes');
  });
});
