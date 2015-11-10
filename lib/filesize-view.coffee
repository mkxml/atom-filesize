{View} = require "atom-space-pen-views"

module.exports =
class FilesizeView extends View

  visible: no

  shouldDisplay: yes

  showPopup: true

  tooltip: null

  @content: ->
    @div class: "file-size inline-block", =>
      @a class: "file-size-link", =>
        @span "", class: "current-size", outlet: "currentSize"

  initialize: (showPopup) ->
    @togglePopupAppearance(showPopup)
    @wk = atom.views.getView(atom.workspace)

  display: (info) ->
    #Inject file size span on status bar. Next to the file path
    if @shouldDisplay
      @show()
      fzElement = @wk.querySelector(".current-size")
      fzElement?.innerHTML = info.size
      if @showPopup
        html = @createTooltip(info)
        @tooltip?.dispose()
        @tooltip = @instanceTooltip(this, html)

  instanceTooltip: (target, tooltipHTML) ->
    return atom.tooltips.add(target, {
      template: '<div class="tooltip" role="tooltip">
      <div class="tooltip-arrow"></div><div class="tooltip-outer">
      <div class="tooltip-inner" style="padding: 0;"></div></div></div>'
      title: tooltipHTML
      placement: 'top'
      trigger: 'click'
      delay: 0
      animation: false
    })

  createTooltip: (info) ->
    outer = document.createElement('div')
    content = document.createElement('div')
    infoContainer = document.createElement('table')
    content.style.width = '100%'
    content.style.display = 'block'
    content.style.margin = '0'
    content.style.padding = '8px'
    content.style.background = 'inherit'
    content.style.borderRadius = 'inherit'

    infoContainer.style.display = 'block'
    infoContainer.style.border = '0'
    infoContainer.style.borderCollapse = 'collapse'
    infoContainer.style.margin = '0'
    infoContainer.style.padding = '0'
    infoContainer.style.width = '100%'
    infoContainer.style.minWidth = '35em'
    infoContainer.style.background = 'black'
    infoContainer.style.color = '#DDD'
    infoContainer.style.opacity = '0.75'
    infoContainer.style.listStyle = 'none'
    infoContainer.style.borderRadius = 'inherit'
    infoContainer.style.margin = '0 auto'

    itemsHTML = ""

    if info.size?
      itemsHTML += @createListItem("Size", info.size)

    if info.mimeType?
      itemsHTML += @createListItem("Mime type", info.mimeType)

    if info.dateCreated?
      itemsHTML += @createListItem("Creation date", info.dateCreated)

    if info.dateChanged?
      itemsHTML += @createListItem("Last changed", info.dateChanged)

    if info.dimensions.w? and info.dimensions.h?
      rect = "#{info.dimensions.w}x#{info.dimensions.h}"
      itemsHTML += @createListItem("Dimensions", rect)

    infoContainer.innerHTML =
      "<tbody style='display: block; width: 100%;'>
        #{itemsHTML}
      <tbody/>"

    titleContainer = document.createElement('p')
    titleContainer.style.fontSize = '1em'
    title = document.createTextNode(info.absolutePath)
    titleContainer.appendChild(title)
    content.appendChild(titleContainer)
    content.appendChild(infoContainer)
    outer.appendChild(content)
    return outer.innerHTML

  createListItem: (label, info) ->
    return "<tr style='display: block; width: 100%; padding: 0; margin: 0;'>
      <td style='width: 40%; padding: 10px 20px; margin: 0; display:
       inline-block; text-align: right; vertical-align: middle;'>#{label}</td>
      <td style='width: 50%; padding: 10px 20px; margin: 0; display:
       inline-block; text-align: left; vertical-align:
        middle;'>#{info}</td>
    </tr>"

  togglePopupAppearance: (showPopup) ->
    @showPopup = showPopup

  show: ->
    if not @visible
      @visible = yes
      return this
    return null

  hide: ->
    @tooltip?.dispose()
    @wk.querySelector(".current-size")?.innerHTML = ""
    @visible = no

  destroy: ->
    @hide()
    @shouldDisplay = no
