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
  },

  workspace: null,
  filesizeView: null,
  disposables: null,
  view: null,
  tile: null,
  active: false,

  activate() {
    // Requiring atom components
    this.workspace = atom.views.getView(atom.workspace);
    this.disposables = new CompositeDisposable();
    // Getting the filesize view
    this.view = filesizeView(this.workspace);
    // Trigger initial UI refresh
    this.scheduleSizeUpdate();
  },

  checkActionEvents(editor) {
    if (!this.active && editor.onDidChangePath) {
      // Register action events
      const boundScheduleUpdate = this.scheduleSizeUpdate.bind(this);
      this.disposables.add(editor.onDidChangePath(() => boundScheduleUpdate()));
      this.disposables.add(atom.workspace.onDidChangeActivePaneItem(() => boundScheduleUpdate()));
      this.workspace.addEventListener('core:save', boundScheduleUpdate, false);
      this.disposables.add(new Disposable(() => {
        this.workspace.removeEventListener('core:save', boundScheduleUpdate);
      }));
      this.active = true;
    }
  },

  scheduleSizeUpdate() {
    const editor = atom.workspace.getActiveTextEditor() || {};
    this.checkActionEvents(editor);
    const editorBuffer = editor.buffer;
    const file = (editorBuffer) ? editorBuffer.file : false;
    let filepath;
    if (file) {
      filepath = file.path;
      loadFileInfoAsync(filepath)
        .then(this.view.refresh)
        .catch(this.view.clean);
    } else {
      this.view.clean();
    }
    return this;
  },

  consumeStatusBar(statusBar) {
    const element = this.view.container;
    if (element) {
      this.tile = statusBar.addLeftTile({ item: element, priority: 25 });
    }
    return this;
  },

  deactivate() {
    if (this.tile) this.tile.destroy();
    if (this.view) this.view.destroy();
    if (this.disposables) this.disposables.dispose();
    this.view = null;
    this.tile = null;
  },

};
