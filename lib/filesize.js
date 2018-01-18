'use babel';

import { Disposable, CompositeDisposable } from 'atom'; // eslint-disable-line
import { loadFileInfoAsync } from 'filesize-calculator';
import filesizeView from './filesize-view';

export default {
  config: {
    UseDecimal: {
      type: 'boolean',
      default: false,
    },
    EnablePopupAppearance: {
      type: 'boolean',
      default: true,
    },
    DisplayFullDayTimeOnPopup: {
      type: 'boolean',
      default: true,
    },
    DisplayGzippedSizeOnPopup: {
      type: 'boolean',
      default: true,
    },
  },

  workspace: null,
  filesizeView: null,
  disposables: null,
  view: null,
  tile: null,
  status: 'activating',

  activate() {
    // Requiring atom components
    this.workspace = atom.views.getView(atom.workspace);
    this.disposables = new CompositeDisposable();
    // Getting the filesize view
    this.view = filesizeView(this.workspace);
    // Trigger initial UI refresh
    return this.scheduleSizeUpdate();
  },

  registerActionEvents() {
    if (this.status !== 'active') {
      // Register action events
      const boundScheduleUpdate = this.scheduleSizeUpdate.bind(this);
      this.disposables.add(atom.workspace.onDidChangeActivePaneItem(boundScheduleUpdate));
      this.workspace.addEventListener('core:save', boundScheduleUpdate, false);
      this.disposables.add(new Disposable(() => {
        this.workspace.removeEventListener('core:save', boundScheduleUpdate);
      }));
      this.status = 'active';
    }
    return this.status;
  },

  scheduleSizeUpdate() {
    setTimeout(() => {
      this.registerActionEvents();
      const editor = atom.workspace.getActivePaneItem() || {};
      // Atom TextEditor keep the file string in the buffer object
      const editorBuffer = editor.buffer;
      // Check if we're dealing with a text editor, an image editor or neither
      const file = (editorBuffer) ? editorBuffer.file : editor.file;
      if (file) {
        if (file.path) {
          return loadFileInfoAsync(file.path)
            .then(this.view.refresh)
            .catch(this.view.clean);
        }
        if (editorBuffer) {
          const contentLength = editorBuffer.getText().length;
          return this.view.refresh({
            absolutePath: file._path || '',
            size: contentLength,
            isRemote: true
          });
        }
      }
      return Promise.resolve(this.view.clean());
    }, 0)
  },

  consumeStatusBar(statusBar) {
    const element = this.view.container;
    if (element) {
      this.tile = statusBar.addLeftTile({ item: element, priority: 25 });
    }
    return this;
  },

  deactivate() {
    if (this.view) this.view.destroy();
    if (this.tile) this.tile.destroy();
    if (this.disposables) this.disposables.dispose();
    this.view = null;
    this.tile = null;
    this.status = 'disabled';
    return this;
  },
};
