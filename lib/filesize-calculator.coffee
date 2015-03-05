fs = require("fs")

module.exports =
class FilesizeCalculator

  @BASE_1024 = [
    "bytes"
    "KiB"
    "MiB"
    "GiB"
    "TiB"
    "PiB"
    "EiB"
    "ZiB"
    "YiB"
  ]

  @BASE_1000 = [
    "bytes"
    "KB"
    "MB"
    "GB"
    "TB"
    "PB"
    "EB"
    "ZB"
    "YB"
  ]

  activeBase: null

  constructor: (@multiple) ->
    if not @multiple? or typeof @multiple isnt "number" then @multiple = 1024
    @setActiveBase(multiple)

  fetchReadableSize: (callback) ->
    @getSize (size, err) =>
      @makeReadable(size, err, callback)

  setMultiple: (multiple) ->
    @multiple = multiple
    @setActiveBase(multiple)

  setActiveBase: (multiple) ->
    if @multiple is 1024 then @activeBase = FilesizeCalculator.BASE_1024
    if @multiple is 1000 then @activeBase = FilesizeCalculator.BASE_1000

  getSize: (callback) ->
    editor = atom.workspace.getActiveTextEditor()
    filePath = null
    try
      file = editor?.buffer.file
      filePath = file?.path
    #User opened settings or some tab without file
    catch error
      callback.apply(this, [null, "Can't get size now"])
      return
    if filePath?
      #Use Node.JS filesystem to get the size stat
      fs.stat filePath, (err, stats) ->
        if err?
          #if atom.getLoadSettings().devMode
          console.warn("File size not available, path not found.")
          callback.apply(this, [null, "File not found"])
        else
          callback.apply(this, [stats.size, null])
    else
      callback.apply(this, [null, "Can't get size now"])

  makeReadable: (size, err, callback) ->
    if err? or not size?
      callback.apply(this, [null, err])
      return null
    if size is 0
      if callback? and typeof callback is "function"
        callback.apply(this, ["0 bytes", null])
        return
      else
        return "0 bytes"
    if size is 1
      if callback? and typeof callback is "function"
        callback.apply(this, ["1 byte", null])
        return
      else
        return "1 byte"
    scale = Math.floor(Math.log(size) / Math.log(@multiple))
    metric = @activeBase[scale]
    size = size / Math.pow(@multiple, scale)
    #Efficiently round it to 2 decimal precision
    size = Number(Math.round(size + "e+2")  + "e-2")
    result = "#{size} #{metric}"
    if callback? and typeof callback is "function"
      callback.apply(this, [result, null])
    else
      return result
