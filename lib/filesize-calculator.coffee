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
    "image/webp"
    "image/vnd.adobe.photoshop"
  ]

  activeBase: null

  hourFormat: "HH:mm:ss"

  constructor: (@multiple, hourFormat) ->
    if not @multiple? or typeof @multiple isnt "number" then @multiple = 1024
    @setHourFormat(hourFormat)
    @setActiveBase(multiple)

  fetchReadableInfo: (callback) ->
    @getInfo (info, err) =>
      @makeReadable(info, err, callback)

  setMultiple: (multiple) ->
    @multiple = multiple
    @setActiveBase(multiple)

  setHourFormat: (hourFormat) ->
    if hourFormat then @hourFormat = "HH:mm:ss" else @hourFormat = "hh:mm:ss a"

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
      dimensions: {
        w: null
        h: null
      }
    }
    editor = atom.workspace.getActivePaneItem()
    filePath = null
    try
      file = editor?.buffer?.file or editor?.file
      filePath = file?.path
    #User opened settings or some tab without file
    catch error
      callback.apply(this, [null, "Can't get size now"])
      return
    if filePath?
      #Use Node.JS filesystem to get the size stat
      fs.stat filePath, (err, stats) =>
        if err?
          #if atom.getLoadSettings().devMode
          console.warn("File size not available, path not found.")
          callback.apply(this, [null, "File not found"])
        else
          info.absolutePath = filePath
          info.mimeType = mime.lookup(filePath)
          info.size = stats.size
          info.dateCreated = moment(stats.birthtime)
          .format("MMMM Do YYYY, #{@hourFormat}")
          info.dateChanged = moment(stats.mtime)
          .format("MMMM Do YYYY, #{@hourFormat}")
          if info.mimeType in FilesizeCalculator.IMAGE_SUPPORT
            try
              imageRect = imageSize(filePath)
              info.dimensions.w = imageRect.width
              info.dimensions.h = imageRect.height
            catch error
              console.warn("Invalid image format!")
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
