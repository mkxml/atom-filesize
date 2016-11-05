'use babel';

/* eslint-disable */
import { Disposable, CompositeDisposable } from 'atom';
/* eslint-enable */
import filesizeView from './filesize-view';
import { loadFileInfoAsync } from './filesize-calculator';

export default {
  config: {
    KibibyteRepresentation: {
      type: 'boolean',
      default: true,
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
    this.registerActionEvents();
    const editor = atom.workspace.getActivePaneItem() || {};
    // Atom TextEditor keep the file string in the buffer object
    const editorBuffer = editor.buffer;
    // Check if we're dealing with a text editor, an image editor or neither
    const file = (editorBuffer) ? editorBuffer.file : editor.file;
    let filepath;
    if (file) {
      filepath = file.path;
      return loadFileInfoAsync(filepath)
        .then(this.view.refresh)
        .catch(this.view.clean);
    }
    return Promise.resolve(this.view.clean());
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
  },

};
