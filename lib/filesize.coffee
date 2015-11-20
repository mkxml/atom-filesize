module.exports =

  config:
    KibibyteRepresentation:
      type: "boolean"
      default: true
    "EnablePopupAppearance":
      type: "boolean"
      default: true
    "DisplayFullDayTimeOnPopup":
      type: "boolean"
      default: true

  wk: null
  editor: null

  filesizeView: null
  filesizeCalculator: null

  activate: ->
    # Requiring external files
    {Disposable, CompositeDisposable} = require "atom"
    FilesizeView = require("./filesize-view")
    FilesizeCalculator = require("./filesize-calculator")

    @wk = atom.views.getView(atom.workspace)
    @editor = atom.workspace.getActiveTextEditor()
    @disposables = new CompositeDisposable

    showPopup = atom.config.get("filesize.EnablePopupAppearance")

    #Instantiate FilesizeView
    @filesizeView = new FilesizeView(showPopup)

    multiple = 1024

    use24Hour = atom.config.get("filesize.DisplayFullDayTimeOnPopup")

    if atom.config.get('filesize.KibibyteRepresentation') is false
      multiple = 1000

    #Instantiate FilesizeCalculator
    @filesizeCalculator = new FilesizeCalculator(multiple, use24Hour)

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

    atom.config.observe "filesize.DisplayFullDayTimeOnPopup", (checked) =>
      @filesizeCalculator.setHourFormat(checked)

    atom.config.observe "filesize.EnablePopupAppearance", (checked) =>
      @filesizeView.togglePopupAppearance(checked)

    #Start package automatically on load
    @exec()


  # Managing status-bar package
  consumeStatusBar: (statusBar) ->
    item = @filesizeView.show()
    if item?
      @filesizeTile = statusBar.addLeftTile(item: item, priority: 25)

  deactivate: ->
    try
      # Remove tile from status bar
      @filesizeTile?.destroy()

      #Destroy FilesizeView instance
      if @filesizeView?
        @filesizeView.destroy()
        @filesizeView = null

      #Destroy FilesizeCalculator
      if @filesizeCalculator?
        @filesizeCalculator = null

      @disposables?.dispose()
    catch error
      console.log('Filesize deactivated through settings')

  exec: (callback) ->
    @filesizeCalculator?.fetchReadableInfo (info, err) =>
      if not err?
        @filesizeView.display(info)
        if callback? and typeof callback is "function"
          callback.apply(this, [null])
      else
        @filesizeView.hide()
        if callback? and typeof callback is "function"
          callback.apply(this, [err])
