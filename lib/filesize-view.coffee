{View} = require "atom-space-pen-views"

module.exports =
class FilesizeView extends View

  visible: no

  shouldDisplay: yes

  @content: ->
    @div class: "file-size inline-block", =>
      @span "", class: "current-size", outlet: "currentSize"

  initialize: ->
    @wk = atom.views.getView(atom.workspace)

  display: (info) ->
    #Inject file size span on status bar. Next to the file path
    if @shouldDisplay
      @show()
      fzElement = @wk.querySelector(".current-size")
      fzElement?.innerHTML = info

  show: ->
    if not @visible
      #Append filesize to the left of the status-bar component
      statusBar = @wk.querySelector(".status-bar")
      statusBar?.appendLeft(this)
      @visible = yes

  hide: ->
    @wk.querySelector(".file-size")?.remove()
    @visible = no

  destroy: ->
    @hide()
    @shouldDisplay = no
