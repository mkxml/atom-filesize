{View} = require("atom")

module.exports =
class FilesizeView extends View

  visible: no

  shouldDisplay: yes

  @content: ->
    @div class: "file-size inline-block", =>
      @span "", class: "current-size", outlet: "currentSize"

  initialize: ->

  display: (info) ->
    #Inject file size span on status bar. Next to the file path
    if @shouldDisplay
      @show()
      #TODO: Find a better way to update the span
      atom.workspaceView.statusBar?.find(".current-size")[0].innerHTML = info

  show: ->
    if not @visible
      #Append filesize to the left of the status-bar component
      atom.workspaceView.statusBar?.appendLeft(this)
      @visible = yes

  hide: ->
    atom.workspaceView.statusBar?.find(".file-size").remove()
    @visible = no

  destroy: ->
    @hide()
    @shouldDisplay = no
