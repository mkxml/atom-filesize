{Disposable, CompositeDisposable} = require "atom"
FilesizeView = require("./filesize-view")
FilesizeCalculator = require("./filesize-calculator")

module.exports =

  config:
    KibibyteRepresentation:
      type: "boolean"
      default: true

  wk: null
  editor: null

  filesizeView: null
  filesizeCalculator: null

  activate: ->
    @wk = atom.views.getView(atom.workspace)
    @editor = atom.workspace.getActiveTextEditor()
    @disposables = new CompositeDisposable

    #Instantiate FilesizeView
    @filesizeView = new FilesizeView()

    #Instantiate FilesizeCalculator
    @filesizeCalculator = new FilesizeCalculator(@filesizeView)

    #Register action events
    @disposables.add @editor?.onDidChangePath => @exec()
    @disposables.add atom.workspace.onDidChangeActivePaneItem => @exec()
    @wk.addEventListener "core:save", =>
      @exec()
    , false
    @disposables.add new Disposable =>
      @wk.removeEventListener "core:save", => @exec()

    #Observe config changes
    atom.config.observe "filesize.KibibyteRepresentation", (checked) =>
      multiple = 1024
      if checked
        multiple = 1024
      else
        multiple = 1000
      @filesizeCalculator.setMultiple(multiple)

    #Start package automatically on load
    @exec()

  deactivate: ->
    #Destroy FilesizeView instance
    if @filesizeView?
      @filesizeView.destroy()
      @filesizeView = null

    #Destroy FilesizeCalculator
    if @filesizeCalculator?
      @filesizeCalculator = null

    @disposables.dispose()

  exec: (callback) ->
    @filesizeCalculator?.fetchReadableSize (info, err) =>
      if not err?
        @filesizeView.display(info)
        if callback? and typeof callback is "function"
          callback.apply(this, [null])
      else
        @filesizeView.hide()
        if callback? and typeof callback is "function"
          callback.apply(this, [err])
