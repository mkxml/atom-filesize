'use babel';

describe('Filesize plugin', () => {
  let workspaceView = null;
  beforeEach(() => {
    waitsForPromise(() => atom.workspace.open(`${__dirname}/fixtures/atom_icon.png`));
    waitsForPromise(() => atom.packages.activatePackage('status-bar'));
    waitsForPromise(() => atom.packages.activatePackage('filesize'));
    workspaceView = atom.views.getView(atom.workspace);
  });
  describe('when activating', () => {
    it('should appear as active to Atom', () => {
      expect(atom.packages.isPackageActive('filesize')).toEqual(true);
    });
    it('should appear on the status-bar component', () => {
      const statusBar = workspaceView.querySelector('.status-bar');
      expect(statusBar.querySelector('.file-size')).not.toEqual(null);
    });
  });
  describe('when deactivating', () => {
    beforeEach(() => {
      atom.packages.deactivatePackage('filesize');
    });
    it('should appear as inactive to Atom', () => {
      expect(atom.packages.isPackageActive('filesize')).toEqual(false);
    });
    it('should disappear from the status-bar component', () => {
      const statusBar = workspaceView.querySelector('.status-bar');
      expect(statusBar.querySelector('.file-size')).toEqual(null);
    });
  });
});
