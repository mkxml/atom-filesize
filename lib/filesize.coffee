FilesizeView = require("./filesize-view")
FilesizeCalculator = require("./filesize-calculator")

module.exports =

  configDefaults:
    KibibyteRepresentation: true

  filesizeView: null
  filesizeCalculator: null

  activate: ->
    #Instantiate FilesizeView
    @filesizeView = new FilesizeView()

    #Instantiate FilesizeCalculator
    @filesizeCalculator = new FilesizeCalculator(@filesizeView)

    #Register action events
    atom.workspaceView.on "filesize:activate", => @exec()
    atom.workspaceView.on "editor:path-changed", => @exec()
    atom.workspaceView.on "pane-container:active-pane-item-changed", => @exec()
    atom.workspaceView.on "core:save", => @exec()

    #Observe config changes
    atom.config.observe "filesize.KibibyteRepresentation", =>
      multiple = 1024
      if atom.config.get("filesize.KibibyteRepresentation")
        multiple = 1024
      else
        multiple = 1000
      @filesizeCalculator.setMultiple(multiple)

    #Start package automatically on load
    atom.workspaceView.trigger("filesize:activate")

  deactivate: ->
    #Destroy FilesizeView instance
    if @filesizeView?
      @filesizeView.destroy()
      @filesizeView = null

    #Destroy FilesizeCalculator
    if @filesizeCalculator?
      @filesizeCalculator = null

    #Unsubscribe events
    atom.workspaceView.off "filesize:activate", => @exec()
    atom.workspaceView.off "editor:path-changed", => @exec()
    atom.workspaceView.off "pane-container:active-pane-item-changed", => @exec()
    atom.workspaceView.off "core:save", => @exec()

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
