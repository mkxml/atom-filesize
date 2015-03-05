StatusBarView = require(atom.packages.resolvePackagePath("status-bar") +
"/lib/status-bar-view")
FilesizeView = require("../lib/filesize-view")

#FilesizeView instance
view = null

xdescribe "FilesizeView", ->

  _workspaceView = null

  beforeEach ->
    #Mock status-bar component for testing
    atom.workspace.addBottomPanel(item: new StatusBarView())
    workspaceView = atom.views.getView(atom.workspace)
    _workspaceView = workspaceView
    view = new FilesizeView()
    waitsForPromise ->
      atom.packages.activatePackage("filesize")
    runs ->
      jasmine.attachToDOM(workspaceView)
      atom.workspace.open("spec/fixtures/test.txt")

  it "should create and append the file-size div to the status-bar", ->
    expect(_workspaceView.querySelectorAll(".file-size").length).toEqual(0)
    view.show()
    expect(_workspaceView.querySelectorAll(".file-size").length).toEqual(1)

  it "should update the value of size when .display() is called", ->
    expect(_workspaceView.querySelectorAll(".file-size").length).toEqual(0)
    view.display("9 KB")
    expect(_workspaceView.querySelector(".file-size").text())
    .toEqual("9 KB")
    view.display("7 KB")
    expect(_workspaceView.querySelector(".file-size").text())
    .toEqual("7 KB")

  it "should unappend any file-size div when .hide() is called", ->
    expect(_workspaceView.querySelectorAll(".file-size").length).toEqual(0)
    view.display("9 KB")
    expect(_workspaceView.querySelector(".file-size").text())
    .toEqual("9 KB")
    view.hide()
    expect(_workspaceView.querySelectorAll(".file-size").length).toEqual(0)
    expect(view.visible).toBe(false)

  it "should hide and not display again when .destroy() is called", ->
    expect(_workspaceView.querySelectorAll(".file-size").length).toEqual(0)
    view.display("9 KB")
    expect(_workspaceView.querySelector(".file-size").text())
    .toEqual("9 KB")
    view.destroy()
    expect(_workspaceView.querySelectorAll(".file-size").length).toEqual(0)
    expect(view.visible).toBe(false)
    expect(view.shouldDisplay).toBe(false)
    view.display("9 KB")
    expect(_workspaceView.querySelectorAll(".file-size").length).toEqual(0)
