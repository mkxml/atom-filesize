fs = require("fs")
imageSize = require("image-size")
mime = require("mime")
moment = require("moment")

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

  @IMAGE_SUPPORT = [
    "image/bmp"
    "image/jpeg"
    "image/png"
    "image/gif"
    "image/tiff"
    "image/x-tiff"
    "image/svg+xml"
    "image/webp"
  ]

  activeBase: null

  constructor: (@multiple) ->
    if not @multiple? or typeof @multiple isnt "number" then @multiple = 1024
    @setActiveBase(multiple)

  fetchReadableInfo: (callback) ->
    @getInfo (info, err) =>
      @makeReadable(info, err, callback)

  setMultiple: (multiple) ->
    @multiple = multiple
    @setActiveBase(multiple)

  setActiveBase: (multiple) ->
    if @multiple is 1024 then @activeBase = FilesizeCalculator.BASE_1024
    if @multiple is 1000 then @activeBase = FilesizeCalculator.BASE_1000

  getInfo: (callback) ->
    info = {
      absolutePath: null
      size: null
      mimeType: null
      dateCreated: null
      dateChanged: null
      dimmensions: {
        w: null
        h: null
      }
    }
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
          info.absolutePath = filePath
          info.mimeType = mime.lookup(filePath)
          info.size = stats.size
          info.dateCreated = moment(stats.birthtime)
          .format("MMMM Do YYYY, hh:mm:ss a")
          info.dateChanged = moment(stats.mtime)
          .format("MMMM Do YYYY, hh:mm:ss a")
          if info.mimeType in FilesizeCalculator.IMAGE_SUPPORT
            imageRect = imageSize(filePath)
            info.dimmensions.w = imageRect.width
            info.dimmensions.h = imageRect.height
          callback.apply(this, [info, null])
    else
      callback.apply(this, [null, "Can't get size now"])

  makeReadable: (info, err, callback) ->
    if err? or not info?
      callback.apply(this, [null, err])
      return null
    if info.size is 0
      if callback? and typeof callback is "function"
        info.size = "0 bytes"
        callback.apply(this, [info, null])
        return
      else
        return info.size = "0 bytes"
    if info.size is 1
      if callback? and typeof callback is "function"
        info.size = "1 byte"
        callback.apply(this, [info, null])
        return
      else
        return info.size = "1 byte"
    scale = Math.floor(Math.log(info.size) / Math.log(@multiple))
    metric = @activeBase[scale]
    size = info.size / Math.pow(@multiple, scale)
    #Efficiently round it to 2 decimal precision
    size = Number(Math.round(size + "e+2")  + "e-2")
    result = "#{size} #{metric}"
    if callback? and typeof callback is "function"
      info.size = result
      callback.apply(this, [info, null])
    else
      return info.size = result
