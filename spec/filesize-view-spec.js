'use babel';

import filesizeView from '../lib/filesize-view';

describe('View', () => {
  // Disable tooltip, only enable on tests when needed
  atom.config.set('filesize.EnablePopupAppearance', false);

  const workspaceView = atom.views.getView(atom.workspace);
  const view = filesizeView(workspaceView);

  describe('when refreshing the view', () => {
    it('should display the human readable size', () => {
      workspaceView.appendChild(view.container);
      const filesizeElement = workspaceView.querySelector('.current-size');
      view.refresh({ size: 5 });
      expect(filesizeElement.innerHTML).toEqual('5 bytes');
    });
    it('should react to config changes', () => {
      atom.config.set('filesize.UseDecimal', true);
      const filesizeElement = workspaceView.querySelector('.current-size');
      view.refresh({ size: 1024 });
      expect(filesizeElement.innerHTML).toEqual('1.02 kB');
    });
  });

  describe('when cleaning the view', () => {
    it('should wipe the filesize contents', () => {
      view.clean();
      const filesizeElement = workspaceView.querySelector('.current-size');
      expect(filesizeElement.innerHTML).toEqual('');
    });
  });

  describe('when destroying the view', () => {
    it('should remove the file-size element', () => {
      view.destroy();
      const filesizeElement = workspaceView.querySelector('.file-size');
      expect(filesizeElement).toEqual(null);
    });
  });
});

